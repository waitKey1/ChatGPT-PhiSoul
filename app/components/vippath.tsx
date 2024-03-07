import { useEffect, useRef, useState } from "react";
import { Path, SlotID } from "../constant";
import { IconButton } from "./button";
import { EmojiAvatar } from "./emoji";
import styles from "./vippage.moudle.scss";

import LeftIcon from "../icons/left.svg";
import LightningIcon from "../icons/lightning.svg";
import EyeIcon from "../icons/eye.svg";

import { useLocation, useNavigate } from "react-router-dom";
import { Mask, useMaskStore } from "../store/mask";
import Locale from "../locales";
import { useAppConfig, useChatStore } from "../store";
import { MaskAvatar } from "./mask";
import { useCommand } from "../command";
import { showConfirm } from "./ui-lib";
import { BUILTIN_MASK_STORE } from "../masks";

function MaskItem(props: { mask: Mask; onClick?: () => void }) {
  return (
    <div className={styles["mask"]} onClick={props.onClick}>
      <MaskAvatar
        avatar={props.mask.avatar}
        model={props.mask.modelConfig.model}
      />
      <div className={styles["mask-name"] + " one-line"}>{props.mask.name}</div>
    </div>
  );
}

function useMaskGroup(masks: Mask[]) {
  const [groups, setGroups] = useState<Mask[][]>([]);

  useEffect(() => {
    const computeGroup = () => {
      const appBody = document.getElementById(SlotID.AppBody);
      if (!appBody || masks.length === 0) return;

      const rect = appBody.getBoundingClientRect();
      const maxWidth = rect.width;
      const maxHeight = rect.height * 0.6;
      const maskItemWidth = 120;
      const maskItemHeight = 50;

      const randomMask = () => masks[Math.floor(Math.random() * masks.length)];
      let maskIndex = 0;
      const nextMask = () => masks[maskIndex++ % masks.length];

      const rows = Math.ceil(maxHeight / maskItemHeight);
      const cols = Math.ceil(maxWidth / maskItemWidth);

      const newGroups = new Array(rows)
        .fill(0)
        .map((_, _i) =>
          new Array(cols)
            .fill(0)
            .map((_, j) => (j < 1 || j > cols - 2 ? randomMask() : nextMask())),
        );

      setGroups(newGroups);
    };

    computeGroup();

    window.addEventListener("resize", computeGroup);
    return () => window.removeEventListener("resize", computeGroup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return groups;
}

export function VIPPage() {
  const chatStore = useChatStore();
  const maskStore = useMaskStore();

  const masks = maskStore.getAll();
  const groups = useMaskGroup(masks);

  const navigate = useNavigate();
  const config = useAppConfig();

  const maskRef = useRef<HTMLDivElement>(null);

  const { state } = useLocation();

  const startChat = (mask?: Mask) => {
    setTimeout(() => {
      chatStore.newSession(mask);
      navigate(Path.Chat);
    }, 10);
  };

  useCommand({
    mask: (id) => {
      try {
        const mask = maskStore.get(id) ?? BUILTIN_MASK_STORE.get(id);
        startChat(mask ?? undefined);
      } catch {
        console.error("[New Chat] failed to create chat from mask id=", id);
      }
    },
  });

  useEffect(() => {
    if (maskRef.current) {
      maskRef.current.scrollLeft =
        (maskRef.current.scrollWidth - maskRef.current.clientWidth) / 2;
    }
  }, [groups]);

  return (
    <div className="body">
      <div className="top">开通哲灵会员</div>
      <p className="tip1">将为您带来更多体验</p>
      <p className="tip2">解锁更多功能与权限!</p>
      <div className="container">
        <div className="plan">
          <div className="plan-title">免费</div>
          <div className="plan-price">¥0/月</div>
          <b>适用人群：AI使用需求较少的人.解锁</b>
          <ul className="plan-features">
            <li>每日30条 GPT3.5使用权限</li>
            <li>每日2条 GPT4.0使用权限</li>
            <li>全部mask使用权限</li>
            <li>不限Web、Android、IOS上访问</li>
          </ul>
          <p className="plan-button">点击即送！</p>
        </div>

        <div className="plan">
          <div className="plan-title">普通会员</div>
          <div className="plan-price">¥1/月</div>

          <b>适用人群：AI时代的普通用户.解锁</b>
          <ul className="plan-features">
            <li>每日1000条的GPT3.5的消息、交互和历史记录！</li>
            <li>每日8条GPT4.0的使用权限</li>
            <li>全部mask的使用权限</li>
            <li>支持自定义mask</li>
            <li>不限Web、Android、IOS上访问</li>
          </ul>
          <a href="#" className="plan-button">
            立即订阅！
          </a>
        </div>

        <div className="plan">
          <div className="plan-title">超级会员</div>
          <div className="plan-price">¥25/月</div>
          <b>适用人群：AI时代的深度用户.解锁</b>
          <ul className="plan-features">
            <li>普通会员全部功能！</li>
            <li>每日的GPT4.0的消息、交互和历史记录！</li>
            <li>高峰期，请求最高优先级！</li>
            <li>哲灵AIGC社群邀请！</li>
          </ul>
          <a href="#" className="plan-button">
            立即订阅！
          </a>
        </div>
      </div>
    </div>
  );
}
