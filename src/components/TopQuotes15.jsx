import React, { useEffect, useState } from "react";
import styles from "../styles/TopQuotes.module.css";
import { supabase } from "../supabaseClient";
import iconCopy from "../img/IconCopy.svg";
import iconShare from "../img/IconShare.svg";
import { t } from "../utils/i18n";

const TopQuotes15 = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState(null);

  useEffect(() => {
    const fetchTopQuotes = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("top_15_quotes").select("*");
      if (error) {
        setQuotes([]);
        setLoading(false);
        return;
      }
      setQuotes(data);
      setLoading(false);
    };
    fetchTopQuotes();
  }, []);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1600);
  };

  const handleShare = (text) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Цитата",
          text,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      alert("Функция шэринга не поддерживается на этом устройстве.");
    }
  };

  return (
    <div className={styles.topQuotesWrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("topQuotes")}</h1>
      </header>
      {loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : (
        <div className={styles.quotesList}>
          {quotes.map((q, idx) => (
            <div className={styles.quoteCard} key={idx}>
              <div className={styles.quoteHeader}>
                <span className={styles.quoteNumber}>{idx + 1}.</span>
                <br />
                <br />
                <span className={styles.peopleCount}>
                  {q.saves_count} {t("peopleSaved") || "чел. сохранили"}
                </span>
              </div>
              <div className={styles.quoteText}>"{q.response}"</div>
              <div className={styles.actions}>
                <div style={{ position: "relative" }}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => handleCopy(q.response, idx)}
                    aria-label={t("copy")}
                  >
                    <img src={iconCopy} alt="Скопировать" />
                  </button>
                  {copiedIdx === idx && (
                    <div className={styles.popover}>Скопировано!</div>
                  )}
                </div>
                <button
                  className={styles.actionBtn}
                  onClick={() => handleShare(q.response)}
                  aria-label={t("share")}
                >
                  <img src={iconShare} alt="Поделиться" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopQuotes15;
