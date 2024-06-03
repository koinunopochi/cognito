// Id系
// Amazon Cognito > ユーザープール > ユーザープール ID
const UserPoolId = 'ap-northeast-1_XXXXXXX';
// Amazon Cognito > ユーザープール > [ユーザープール名] ⇒ アプリケーションの統合⇒アプリクライアントと分析⇒クライアントID
const ClientId = 'XXXXXXXXXXXXXXXXXXXXXXXXX';

function OnCognitoSignUp() {
  var poolData = {
    UserPoolId: UserPoolId, // Your user pool id here
    ClientId: ClientId, // Your client id here
  };
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  console.log('email is ' + email);
  console.log('password is ' + password);

  var attributeList = [
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'email',
      Value: email,
    }),
  ];

  userPool.signUp(email, password, attributeList, null, function (err, result) {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    var cognitoUser = result.user;
    console.log('user name is ' + cognitoUser.getUsername());
  });
}
