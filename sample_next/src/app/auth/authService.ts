// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  GetUserCommand,
  GlobalSignOutCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import config from "./config.json";

export const cognitoClient = new CognitoIdentityProviderClient({
  region: config.region,
});

export const signIn = async (username: string, password: string) => {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: config.clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };
  try {
    const command = new InitiateAuthCommand(params);
    const { AuthenticationResult } = await cognitoClient.send(command);
    if (AuthenticationResult) {
      sessionStorage.setItem("idToken", AuthenticationResult.IdToken || '');
      sessionStorage.setItem("accessToken", AuthenticationResult.AccessToken || '');
      sessionStorage.setItem("refreshToken", AuthenticationResult.RefreshToken || '');
      return AuthenticationResult;
    }
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error;
  }
};

export const signUp = async (email: string, password: string) => {
  const params = {
    ClientId: config.clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  };
  try {
    const command = new SignUpCommand(params);
    const response = await cognitoClient.send(command);
    console.log("Sign up success: ", response);
    return response;
  } catch (error) {
    console.error("Error signing up: ", error);
    throw error;
  }
};

export const confirmSignUp = async (username: string, code: string) => {
  const params = {
    ClientId: config.clientId,
    Username: username,
    ConfirmationCode: code,
  };
  try {
    const command = new ConfirmSignUpCommand(params);
    await cognitoClient.send(command);
    console.log("User confirmed successfully");
    return true;
  } catch (error) {
    console.error("Error confirming sign up: ", error);
    throw error;
  }
};

// src/app/auth/authService.ts
// ...

export const getSession = async () => {
  if (typeof window !== 'undefined') {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      return null;
    }

    try {
      const params = {
        AccessToken: accessToken,
      };
      const command = new GetUserCommand(params);
      const response = await cognitoClient.send(command);

      if (response.Username) {
        return {
          email: response.UserAttributes?.find(attr => attr.Name === 'email')?.Value || '',
          // その他のセッション情報を追加できます
        };
      } else {
        console.error('User not found');
        return null;
      }
    } catch (error) {
      console.error('Error getting session: ', error);
      return null;
    }
  }
  return null;
};

// src/app/auth/authService.ts
// ...

export const signOut = async () => {
  try {
    const accessToken = sessionStorage.getItem('accessToken');

    if (!accessToken) {
      throw new Error('Access token not found');
    }

    // セッションストレージからトークンを削除
    sessionStorage.removeItem('idToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');

    // Cognito UserPoolからサインアウト
    const params = {
      AccessToken: accessToken,
    };
    const command = new GlobalSignOutCommand(params);
    await cognitoClient.send(command);

    console.log('Sign out successful');
    return true;
  } catch (error) {
    console.error('Error signing out: ', error);
    throw error;
  }
};