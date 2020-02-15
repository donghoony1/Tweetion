const AWS = require('aws-sdk');
const request = require('request');

AWS.config.accessKeyId = process.env.accessKeyId;
AWS.config.secretAccessKey = process.env.secretAccessKey;

const Bucket = process.env.bucket;
const PathPrefix = process.env.PathPrefix || '';

const oauth = {
    callback: 'oob',
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret
}

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

exports.handler = async (event, context, callback) => {
    await new Promise((resolve, reject) => {
        if(event.id === undefined) reject({ reference: 2, error: 'There\'s no user id.' });
        if(event.count === undefined) reject({ reference: 2, error: 'There\'s no count of tweets.' });

        request.get(`https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${event.id}&count=${event.count}`, { oauth }, (error, response, body) => {
            if(error) reject(error);
            else if(response.statusCode === 200) resolve(JSON.parse(body));
            else reject({ reference: 0, error: response.statusCode })
        });
    }).then((data) => {
        return new Promise((resolve, reject) => {
            const json = {};
            json.tweets = data.map((tweet) => (
                { 
                    id: ('retweeted_status' in tweet) ? tweet.retweeted_status.id_str : tweet.id_str,
                    created_at: tweet.created_at,
                    text: ('retweeted_status' in tweet) ? tweet.retweeted_status.text : tweet.text, 
                    retweet_count: tweet.retweet_count, 
                    favorite_count: tweet.favorite_count,
                    uid: ('retweeted_status' in tweet) ? tweet.retweeted_status.user.id : tweet.user.id,
                    is_retweet: ('retweeted_status' in tweet)
                }
            ));
            json.users = {};
            data.forEach((tweet) => {
                let user = tweet.user;
                if('retweeted_status' in tweet) user = tweet.retweeted_status.user;
                json.users[user.id] = {
                    'name': user.name,
                    'screen_name': user.screen_name,
                    'profile_image': user.profile_image_url_https
                };
            });
            
            resolve(JSON.stringify(json));
        });
    }).then((Body) => {
        return new Promise((resolve, reject) => {
            const params = {
                Key: `${PathPrefix}data/latest.json`, 
                ACL: 'public-read',
                StorageClass: 'STANDARD',
                Bucket,
                Body
            };
            s3.putObject(params, (error, data) => {
                if(error) reject({ reference: 1, error});
                else {
                    console.log('true');
                    callback(null, true);
                }
            });
        });
    }).catch((error) => callback(JSON.stringify(error.constructor === Object ? error : { reference: -1, error}, null, 4), null));
};