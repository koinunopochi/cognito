const {
  CognitoIdentityProviderClient,GetUserCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const cognitoClient = new CognitoIdentityProviderClient({
  region: 'ap-northeast-1',
});

const getUserData = async (accessToken) => {
  const params = {
    AccessToken: accessToken,
  };
  try {
    const command = new GetUserCommand(params);
    const response = await cognitoClient.send(command);
    console.log('User data: ', response);
    return response;
  } catch (error) {
    console.error('Error getting user data: ', error);
    throw error;
  }
};

module.exports = {
  getUserData,
};