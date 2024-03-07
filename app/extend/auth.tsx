import { getClientConfig } from "../config/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";

export function AuthLogin(username: string, password: string) {
  const navigate = useNavigate();
  useEffect(() => {
    if (getClientConfig()?.isApp) {
      navigate(Path.Settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //拦截

  // 为了演示，我们假设任何用户都是有效的，并返回一个简单的消息
  if (username && password) {
    // 登录成功
    navigate(Path.Chat);
    return true;
  } else {
    // 登录失败
    return false;
  }
}
