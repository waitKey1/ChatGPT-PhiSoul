import styles from "./auth.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";

import BotIcon from "../icons/break.svg";
import { useEffect } from "react";
import { getClientConfig } from "../config/client";
import { authLogin } from "../extend/auth";
import React, { useState } from "react";
export function AuthPage() {
  const navigate = useNavigate();
  const accessStore = useAccessStore();

  const goHome = () => {
    accessStore.update((access) => {
      access.disableGPT4 = true;
    });
    navigate(Path.Home);
  };
  const goChat = () => navigate(Path.Chat);

  const loaginAuto = () => {
    // 为了演示，我们假设任何用户都是有效的，并返回一个简单的消息
    if (accessStore.username == "ad" && accessStore.password == "ad") {
      // 登录成功
      accessStore.update((access) => {
        access.disableGPT4 = false;
      });
      navigate(Path.Chat);
    } else if (
      accessStore.username == "Sztu@2024" &&
      accessStore.password == "1024"
    ) {
      // 登录成功
      accessStore.update((access) => {
        access.disableGPT4 = false;
      });
      navigate(Path.Chat);
    } else if (
      accessStore.username == "Sztu@2025" &&
      accessStore.password == "1024"
    ) {
      // 登录成功
      accessStore.update((access) => {
        access.disableGPT4 = false;
      });

      navigate(Path.Chat);
    } else {
      // 登录失败
      accessStore.update((access) => {
        access.disableGPT4 = true;
      });
      alert("登录失败");
    }
  };
  const resetAccessCode = () => {
    accessStore.update((access) => {
      access.openaiApiKey = "";
      access.accessCode = "meta";
    });
  }; // Reset access code to empty string

  // 获取元素
  const loginButton: HTMLElement | null =
    document.getElementById("loginButton");
  const registerButton: HTMLElement | null =
    document.getElementById("registerButton");

  const modal: HTMLElement | null = document.getElementById("modal");
  const overlay: HTMLElement | null = document.getElementById("overlay");

  const modalContent: HTMLElement | null =
    document.getElementById("modalContent");
  const [isloginActive, setIsloginActive] = useState(true);
  const [isregiterActive, setIsregiterActive] = useState(false);
  if (loginButton && modalContent) {
    // 登录按钮点击事件
    loginButton.addEventListener("click", () => {
      setIsloginActive(true);
      setIsregiterActive(false);
    });
  }
  if (registerButton && modalContent) {
    // 注册按钮点击事件
    registerButton.addEventListener("click", function () {
      setIsloginActive(false);
      setIsregiterActive(true);
    });
  }

  if (overlay && modal) {
    // 点击遮罩层也可以关闭弹窗
    overlay.addEventListener("click", function () {
      modal.style.display = "none";
      overlay.style.display = "none";
      resetButtons();
    });
  }

  // 显示弹窗和遮罩层
  const showModal = () => {
    if (modal && overlay) {
      modal.style.display = "block";
      overlay.style.display = "block";
      setTimeout(function () {
        modal.style.display = "none";
        overlay.style.display = "none";
        resetButtons(); // 2秒后隐藏弹窗和遮罩层，并重置按钮
      }, 2000);
    } else {
      console.error("modal 或 overlay 不存在");
    }
  };

  // 重置按钮样式
  const resetButtons = () => {
    if (loginButton && registerButton) {
      loginButton.classList.remove("active");
      registerButton.classList.remove("active");
    } else {
      console.error("loginButton 或 registerButton 不存在");
    }
  };

  useEffect(() => {
    if (getClientConfig()?.isApp) {
      navigate(Path.Settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //拦截

  return (
    <div className={styles["auth-page"]}>
      <div className={`no-dark ${styles["auth-logo"]}`}>
        <BotIcon />
      </div>

      <div className={styles["auth-title"]}>哲灵AI</div>
      <h1>Welcome back</h1>
      <div className={styles["container"]}>
        <button
          id="loginButton"
          className={`${styles["button"]} ${
            isloginActive ? styles["active"] : ""
          }`}
        >
          登录
        </button>
        <div className={styles["separator"]}></div>
        <button
          id="registerButton"
          className={`${styles["button"]} ${
            isregiterActive ? styles["active"] : ""
          }`}
        >
          注册
        </button>
        <div id="modal" className={styles["modal"]}>
          <p id="modalContent">登录成功</p>
        </div>

        <div id="overlay" className="overlay"></div>
      </div>

      {isloginActive ? (
        <>
          <div className={styles["auth-input"]}>
            <label className="username1">账户：</label>
            <input
              className="username"
              type="text"
              name="username requird"
              placeholder="请输入您的账户"
              onChange={(e) => {
                accessStore.update(
                  (access) => (access.username = e.currentTarget.value),
                );
              }}
            />
          </div>
          <div className={styles["auth-input"]}>
            <label className="passware1">密码：</label>
            <input
              className="passware"
              type="password"
              placeholder="请输入您的密码"
              value={accessStore.password}
              onChange={(e) => {
                accessStore.update(
                  (access) => (access.password = e.currentTarget.value),
                );
              }}
            />
          </div>
        </>
      ) : (
        <>
          <div className={styles["auth-input"]}>
            <label className="username1">昵称：</label>
            <input
              className="username"
              type="text"
              name="username requird"
              placeholder="请输入您的账户"
              onChange={(e) => {
                accessStore.update(
                  (access) => (access.username = e.currentTarget.value),
                );
              }}
            />
          </div>

          <div className={styles["auth-input"]}>
            <label className="passware1">密码：</label>
            <input
              className="passware"
              type="password"
              placeholder="请输入您的密码"
              value={accessStore.password}
              onChange={(e) => {
                accessStore.update(
                  (access) => (access.password = e.currentTarget.value),
                );
              }}
            />
          </div>
          <div className={styles["auth-input"]}>
            <label className="passware1">重复密码：</label>
            <input
              className="passware"
              type="password"
              placeholder="请输入您的密码"
              value={accessStore.password}
              onChange={(e) => {
                accessStore.update(
                  (access) => (access.password = e.currentTarget.value),
                );
              }}
            />
          </div>
        </>
      )}

      {/* {!accessStore.hideUserApiKey ? (    是否显示要填Openai密钥*/}
      {!true ? (
        <>
          <div className={styles["auth-tips"]}>{Locale.Auth.SubTips}</div>
          <input
            className={styles["auth-input"]}
            type="password"
            placeholder={Locale.Settings.Access.OpenAI.ApiKey.Placeholder}
            value={accessStore.openaiApiKey}
            onChange={(e) => {
              accessStore.update(
                (access) => (access.openaiApiKey = e.currentTarget.value),
              );
            }}
          />
          <input
            className={styles["auth-input"]}
            type="password"
            placeholder={Locale.Settings.Access.Google.ApiKey.Placeholder}
            value={accessStore.googleApiKey}
            onChange={(e) => {
              accessStore.update(
                (access) => (access.googleApiKey = e.currentTarget.value),
              );
            }}
          />
        </>
      ) : null}

      <div className={styles["auth-actions"]}>
        <IconButton
          text={Locale.Auth.Confirm}
          type="primary"
          onClick={() => {
            resetAccessCode();
            loaginAuto();
          }}
        />

        <div className="tail">
          <h3 className={styles["auth-h3"]}></h3>
        </div>
        <IconButton
          text="游客登录"
          onClick={() => {
            resetAccessCode();
            goHome();
          }}
        />
      </div>
    </div>
  );
}
