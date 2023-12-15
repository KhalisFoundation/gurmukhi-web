import React from "react";
import { ROUTES } from "constants/routes";
import { useTranslation } from "react-i18next";

export default function Ssa({ name }: { name: string }) {
  const { t: text } = useTranslation();
  return (
    <div>
      <p className="text-3xl">
        <span className="font-medium gurmukhi">{text("SSA_PUNJABI")}</span>{" "}
        <span className="text-3xl text-slate-500 font-serif">
          <a href={ROUTES.PROFILE}>{name}</a>
        </span>
      </p>
    </div>
  );
}
