// Id系
// Amazon Cognito > ユーザープール > ユーザープール ID
const UserPoolId = 'ap-northeast-1_XXXXXXX';
// Amazon Cognito > ユーザープール > [ユーザープール名] ⇒ アプリケーションの統合⇒アプリクライアントと分析⇒クライアントID
const ClientId = 'XXXXXXXXXXXXXXXXXXXXXXXXX';

function OnCognitoConfirmRegistration() {
  var poolData = {
    UserPoolId: UserPoolId, // Your user pool id here
    ClientId: ClientId, // Your client id here
  };
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  var username = document.getElementById('email').value;
  var code = document.getElementById('ConfirmCode').value;

  var userData = {
    Username: username,
    Pool: userPool,
  };

  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.confirmRegistration(code, true, function (err, result) {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    console.log('call result: ' + result);
  });
}
