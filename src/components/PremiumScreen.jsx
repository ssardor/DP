import React from "react";
import { motion } from "framer-motion";
import { t } from "../utils/i18n";
import styles from "../styles/PremiumScreen.module.css";
import planStyles from "../styles/PlansScreen.module.css";

const perks = [
  {
    icon: (
      <svg width="32" height="32" fill="none">
        <circle cx="16" cy="16" r="16" fill="url(#grad1)" />
        <path
          d="M10 16c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6zm6-4a4 4 0 100 8 4 4 0 000-8z"
          fill="#fff"
        />
        <defs>
          <linearGradient
            id="grad1"
            x1="0"
            y1="0"
            x2="32"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6a5af9" />
            <stop offset="1" stopColor="#00c6fb" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: "Unlimited Quotes",
    desc: "Generate as many quotes as you want, without daily limits",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none">
        <circle cx="16" cy="16" r="16" fill="url(#grad2)" />
        <path
          d="M16 8v8l6 6"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="grad2"
            x1="0"
            y1="0"
            x2="32"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00c6fb" />
            <stop offset="1" stopColor="#6a5af9" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: "Priority Generation",
    desc: "Get faster response times for your quote requests",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none">
        <circle cx="16" cy="16" r="16" fill="url(#grad3)" />
        <path
          d="M16 8v12m0 0l-4-4m4 4l4-4"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="grad3"
            x1="0"
            y1="0"
            x2="32"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6a5af9" />
            <stop offset="1" stopColor="#00c6fb" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: "Export Quotes",
    desc: "Save your favorite quotes as images to share on social media",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none">
        <circle cx="16" cy="16" r="16" fill="url(#grad4)" />
        <rect x="10" y="14" width="12" height="6" rx="2" fill="#fff" />
        <rect x="14" y="10" width="4" height="4" rx="2" fill="#fff" />
        <line
          x1="10"
          y1="17"
          x2="22"
          y2="17"
          stroke="#6a5af9"
          strokeWidth="2"
        />
        <defs>
          <linearGradient
            id="grad4"
            x1="0"
            y1="0"
            x2="32"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00c6fb" />
            <stop offset="1" stopColor="#6a5af9" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: "Ad-Free Experience",
    desc: "Enjoy DeepWisdom without any advertisements",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none">
        <circle cx="16" cy="16" r="16" fill="url(#grad5)" />
        <path
          d="M16 10l2.09 4.26L22 15l-3.18 2.74L19.18 22 16 19.27 12.82 22l.36-4.26L10 15l3.91-.74L16 10z"
          fill="#fff"
        />
        <defs>
          <linearGradient
            id="grad5"
            x1="0"
            y1="0"
            x2="32"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6a5af9" />
            <stop offset="1" stopColor="#00c6fb" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: "Early Access",
    desc: "Try new features before everyone else",
  },
];

const plans = [
  {
    label: "Monthly",
    price: "$1.99",
    period: "per month",
    features: ["All premium features", "Cancel anytime"],
    highlight: false,
    discount: null,
    badge: null,
  },
  {
    label: "6 Months",
    price: "$9.99",
    period: "per 6 months",
    features: ["All premium features", "Cancel anytime"],
    highlight: true,
    discount: "Save 16%",
    badge: "Best Value",
  },
  {
    label: "Yearly",
    price: "$19.99",
    period: "per year",
    features: ["All premium features", "Cancel anytime"],
    highlight: false,
    discount: "Save 16%",
    badge: null,
  },
];

export default function PremiumScreen() {
  return (
    <div className={styles.premiumWrapper}>
      <motion.div
        className={styles.crownBlock}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        <motion.div
          className={styles.crownCircle}
          initial={{ scale: 0.7, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <path
              d="M28 8l6.16 12.49L48 22.18l-9.92 9.66L40.32 48 28 40.27 15.68 48l2.24-16.16L8 22.18l13.84-1.69L28 8z"
              fill="#fff"
            />
          </svg>
        </motion.div>
        <h1 className={styles.title}>{t("upgrade")}</h1>
        <p className={styles.subtitle}>{t("unlockFullPotential")}</p>
      </motion.div>
      <div className={styles.perksList}>
        {perks.map((perk, i) => (
          <motion.div
            key={i}
            className={styles.perkItem}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.2 + i * 0.12,
              duration: 0.5,
              type: "spring",
            }}
            whileHover={{ scale: 1.04, boxShadow: "0 4px 24px #6a5af966" }}
          >
            <div className={styles.perkIcon}>{perk.icon}</div>
            <div>
              <div className={styles.perkTitle}>{perk.title}</div>
              <div className={styles.perkDesc}>{perk.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        className={planStyles.plansWrapper}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        viewport={{ once: true }}
      >
        <h2 className={planStyles.plansTitle}>{t("choosePlan")}</h2>
        <div className={planStyles.plansList}>
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              className={`${planStyles.planCard} ${
                plan.highlight ? planStyles.highlight : ""
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.2 + i * 0.15,
                duration: 0.5,
                type: "spring",
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: plan.highlight
                  ? "0 8px 32px #00c6fb77"
                  : "0 4px 18px #6a5af944",
              }}
            >
              {plan.badge && (
                <div className={planStyles.planBadge}>{plan.badge}</div>
              )}
              <div className={planStyles.planLabel}>{plan.label}</div>
              <div className={planStyles.planPrice}>{plan.price}</div>
              <div className={planStyles.planPeriod}>{plan.period}</div>
              {plan.discount && (
                <div className={planStyles.planDiscount}>{plan.discount}</div>
              )}
              <ul className={planStyles.planFeatures}>
                {plan.features.map((f, idx) => (
                  <li key={idx} className={planStyles.planFeature}>
                    <span className={planStyles.planCheck}>✔</span>
                    {f}
                  </li>
                ))}
              </ul>
              <motion.button
                className={`${planStyles.planBtn} ${
                  plan.highlight ? planStyles.planBtnHighlight : ""
                }`}
                whileTap={{ scale: 0.97 }}
                whileHover={{
                  background: plan.highlight
                    ? "linear-gradient(90deg, #00c6fb 0%, #6a5af9 100%)"
                    : "#222",
                  color: "#fff",
                }}
              >
                {t("subscribe")}
              </motion.button>
            </motion.div>
          ))}
        </div>
        <div className={planStyles.plansNote}>
          By subscribing, you agree to our Terms of Service and Privacy Policy.
          Subscriptions automatically renew unless auto-renew is turned off at
          least 24 hours before the end of the current period.
        </div>
      </motion.div>
    </div>
  );
}
