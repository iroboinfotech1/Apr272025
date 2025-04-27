import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import Button from "../../common/Button";

const clientId =
  "531686912380-bt5qnls2h1vi4omu0c4ti2fmhdi0f1ib.apps.googleusercontent.com";

export default function GoogleLoginButton() {
  const login = useGoogleLogin({
    onSuccess: (res) => onSuccess(res),
    flow: 'auth-code',
    scope: "email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid"
  });

  const onSuccess = (res: any) => {
    console.log(res);
  };
  const onFailure = (res: any) => {
    console.log(res);
  };

  return (
    <>
      <Button style="w-full" onClick={() => login()}>Sign in with Google </Button>
    </>
  );
}
