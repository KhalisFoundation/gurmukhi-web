import React from "react";
import { useTranslation } from "react-i18next";
import { wordData } from "constants/wordsData";
function CoinBox({ commonStyle }: { commonStyle: string }) {
  const { t: text } = useTranslation();
  return (
    <div className={commonStyle}>
      <div className="flex justify-center items-center h-full">
        <div>
          <img className="mx-auto my-2" src="/images/nanakCoin.png" alt="Nanak Coin" />
          <p className="font-serif text-sm text-sky-700 mb-2 my-0">{text("COINS_DESC")}</p>
          <p className="text-6xl text-sky-800 mb-7">{wordData.length}</p>
          <p className="font-serif text-sm text-slate-500 w-3/4 m-auto">
            {wordData.length + 1} {text("COINS_DESC2")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CoinBox;
