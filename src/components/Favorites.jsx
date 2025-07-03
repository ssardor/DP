import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "../utils/i18n";
import styles from "../styles/Favorites.module.css";
import { supabase } from "../supabaseClient";
import iconCopy from "../img/IconCopy.svg";
import iconLiked from "../img/heartLiked.png"; // Заполненное сердце
import iconShare from "../img/IconShare.svg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: -300,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadFavorites = React.useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
      localStorage.setItem("favorites_count", (data || []).length);
    } catch (error) {
      console.error("Ошибка загрузки избранного:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Можно добавить toast уведомление
    } catch (error) {
      console.error("Ошибка при копировании:", error);
    }
  };

  const handleShare = async (favorite) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "DeepWisdom Quote",
          text: `${favorite.query}\n\n${favorite.response}`,
        });
      } catch (error) {
        console.error("Ошибка при шаринге:", error);
      }
    }
  };

  const handleRemoveFromFavorites = async (id) => {
    try {
      const { error } = await supabase.from("favorites").delete().eq("id", id);
      if (error) throw error;

      setFavorites((prev) => prev.filter((f) => f.id !== id));

      // Обновляем счетчик избранного
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Получаем текущий профиль пользователя
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("favorites_count")
          .eq("id", user.id)
          .single();

        if (!profileError && profile) {
          await supabase
            .from("profiles")
            .update({
              favorites_count: Math.max((profile.favorites_count || 1) - 1, 0),
            })
            .eq("id", user.id);
        }
      }
    } catch (error) {
      console.error("Ошибка при удалении из избранного:", error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>{t("loadingFavorites")}</div>;
  }

  return (
    <div className={styles.favoritesContainer}>
      <motion.header
        className={styles.header}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>{t("favorites")}</h1>
      </motion.header>

      {loading ? (
        <div className={styles.loading}>
          <motion.div
            className={styles.loadingSpinner}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : favorites.length === 0 ? (
        <motion.div
          className={styles.empty}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("noFavorites")}
        </motion.div>
      ) : (
        <motion.div
          className={styles.quotesList}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {favorites.map((favorite) => (
              <motion.div
                key={favorite.id}
                className={styles.quoteCard}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={styles.quoteContent}>
                  <motion.div
                    className={styles.query}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p>{favorite.query}</p>
                  </motion.div>
                  <motion.div
                    className={styles.response}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p>{favorite.response}</p>
                  </motion.div>
                </div>

                <motion.div
                  className={styles.cardFooter}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className={styles.date}>
                    {new Date(favorite.created_at).toLocaleDateString()}
                  </div>

                  <div className={styles.actions}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleCopy(favorite.response)}
                      title={t("copy")}
                    >
                      <img src={iconCopy} alt="" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveFromFavorites(favorite.id)}
                      title={t("removeFromFavorites")}
                    >
                      <img src={iconLiked} alt="" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleShare(favorite)}
                      title={t("share")}
                    >
                      <img src={iconShare} alt="" />
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Favorites;
