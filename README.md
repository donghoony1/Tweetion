# Tweetion
> Tweet + Notion = Tweetion

Notion에 Twitter User Timeline Block을 추가해 보세요.

[적용 예시](https://www.notion.so/Tweetion-Sample-4618a6d2eb564f949f12846f93cae7fb). 
*이 페이지의 Tweet 새로고침 주기는 12시간입니다. 비용 절약을 위해...*

---

# 🎯 설치하기
## 구성 요소
- AWS S3
- AWS Lambda
- AWS CloudWatch
- AWS IAM
- Node.js 12 LTS+

## 설치 과정
1. S3 Bucket을 생성하세요.
2. `index.html`을 S3 Bucket에 업로드하고 Public Access를 허용하세요.
3. Lambda Function을 생성하고 다음과 같이 설정하세요.
    - `npm install`을 명령하여 `aws-sdk`, `request`와 같은 dependencies packages를 내려받으세요.
    - `index.js` 및 `node_modules`를 압축하세요.
    - Lambda의 Function code로 업로드하세요.
    - `Runtime`은 `Node.js 12.x`로 설정하세요.
    - `Handler`는 `index.handler`로 설정하세요.
    - `Timeout` 값은 5-10초를 권장합니다.
    - `Memory` 값은 불러올 Tweet의 개수에 따라 조정하세요. 보통 `128MB`로 충분합니다.
    - `Environment variables`는 “Environment variables” 파트를 참고하여 입력하세요.
4. CloudWatch Event를 생성하고 다음과 같이 설정하세요.
    - Event Source → Schedule → Fixed rate of `n` Minutes/Hours/Days
        - 만약 CRON Expression을 사용할 수 있다면 사용해도 상관 없습니다.
        - 2-12시간을 권장합니다. 너무 잦은 요청은 과도한 비용을 야기할 수 있습니다.
    - Targets에 앞서 추가한 Lambda Function을 선택하세요.
    - Target의 Configure input → Constant(JSON text)에 다음 내용을 추가하세요. `{"id": "<Twitter ID>", "count": <Maximum tweets>}`
5. IAM Role을 추가하거나 Lambda Function에 연결된 IAM Role에 Inline policy를 다음과 같이 추가하세요.
    - 앞서 생성한 S3 Bucket 및 CloudWatch Log Group에 엑세스할 수 있는 권한
        - Full Access 권한이나 ANY 대신 적절히 ARN으로 지정하는 것을 권장합니다.
6. CloudWatch를 통해 모니터링하세요. 결과로 `true`가 반환되면 정상적으로 작동한 것입니다.

---

# 🎲 Environment variables
- **(String) `accessKeyId`:** AWS Access Key ID를 입력하세요.
	- **주의:** Root 권한을 절대 부여하지 마세요.
- **(String) `secretAccessKey`:** AWS Secret Access Key를 입력하세요.
- **(String) `bucket`:** S3 Bucket 이름을 입력하세요.
- **(String) `PathPrefix`:** S3 Bucket내 경로의 `${PathPrefix}/data`로서 사용할 수 있는 경로 접두사입니다.
- **(String) `consumer_key`:** Twitter App API의 `consumer_key`입니다.
- **(String) `consumer_secret`:** Twitter App API의 `consumer_secret`입니다.

---

# 🚩 제작자
## Dong-Hoon Yoo `개발자`
- Email: yoodonghoon01@gmail.com
- 블로그: [blog.donghoonyoo.com](https://blog.donghoonyoo.com)
- 역할: 개발, 한국어 문서 작성