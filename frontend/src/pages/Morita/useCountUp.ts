// useCountUp.ts
// 0 から目標値まで数字を増やしていくためのフック（完了画面の金額演出に使う）
import { useEffect, useState } from "react";

/**
 * @param target   最終的に表示したい数値
 * @param duration アニメーションにかける時間（ミリ秒）
 * @param delay    開始を遅らせる時間（ミリ秒）
 */
export const useCountUp = (target: number, duration = 800, delay = 300) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frameId: number;
    let startTime: number | null = null;

    // 最初はゆっくり、最後に近づくほど減速させる（ease-out）
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setValue(Math.floor(target * easeOut(progress)));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setValue(target); // 端数で目標値に届かないことがあるので最後に合わせる
      }
    };

    const timerId = setTimeout(() => {
      frameId = requestAnimationFrame(step);
    }, delay);

    // 画面を離れたときにアニメーションを止める（メモリリーク防止）
    return () => {
      clearTimeout(timerId);
      cancelAnimationFrame(frameId);
    };
  }, [target, duration, delay]);

  return value;
};
