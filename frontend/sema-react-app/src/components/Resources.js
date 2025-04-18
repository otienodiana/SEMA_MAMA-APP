import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import dep1 from "../assets/dep1.jpg";
import dep2 from "../assets/dep2.jpg";
import dep3 from "../assets/dep3.jpg";
import dep4 from "../assets/dep4.jpg";
import dep5 from "../assets/dep5.jpg";
import dep6 from "../assets/dep6.jpg";
import dep7 from "../assets/dep7.jpg";
import "./Resources.css"; // Add appropriate styles

const Resources = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "Reproductive Health - NIEHS",
      url: "https://www.niehs.nih.gov/health/topics/conditions/repro-health",
      description: "Article 1: Reproductive Health Information"
    },
    {
      id: 2,
      title: "Birth Control - MedlinePlus",
      url: "https://medlineplus.gov/birthcontrol.html",
      description: "Article 2: Birth Control Information"
    },
    {
      id: 3,
      title: "Maternal Health in Kenya",
      url: "https://ir-library.ku.ac.ke/items/7fea630f-b3a7-4848-88dc-5d2b3caa2477",
      description: "Article 3: Maternal Health Research"
    }
  ]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("resourceFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("resourceFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (article) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some(fav => fav.id === article.id)) {
        return prevFavorites.filter(fav => fav.id !== article.id);
      } else {
        return [...prevFavorites, article];
      }
    });
  };

  const filteredArticles = articles.filter(article => {
    const searchContent = `${article.title} ${article.description}`.toLowerCase();
    return searchContent.includes(searchQuery.toLowerCase());
  });

  const displayedArticles = showFavorites 
    ? filteredArticles.filter(article => favorites.some(fav => fav.id === article.id))
    : filteredArticles;

  return (
    <div className="resources-container">
      <h1>{t('resources.title')}</h1>

      <div className="search-and-filter">
        <input
          type="text"
          placeholder={t('resources.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button 
          className={`filter-button ${showFavorites ? 'active' : ''}`}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? t('resources.showAll') : t('resources.showFavorites')}
        </button>
      </div>

      {/* Articles Section */}
      <div className="resource-section">
        <h2>Articles</h2>
        {displayedArticles.length === 0 ? (
          <p>No articles found. {showFavorites ? 'No favorites yet!' : 'Try a different search term.'}</p>
        ) : (
          <ul>
            {displayedArticles.map((article) => (
              <li key={article.id} className="article-item">
                <div className="article-content">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {t(article.title)}
                  </a>
                  <button 
                    className={`favorite-button ${favorites.some(fav => fav.id === article.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(article)}
                  >
                    {favorites.some(fav => fav.id === article.id) ? '★' : '☆'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Videos Section */}
      <div className="resource-section">
        <h2>Videos</h2>
        {/* Category 1: Postpartum Support */}
        <div className="video-category">
          <h3>Contraceptives</h3>
          <div className="video-embed">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/Zx8zbTMTncs"
              title="Postpartum Exercises"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Category 2: Breastfeeding Support */}
        <div className="video-category">
          <h3>What Is Postpartum?</h3>
          <div className="video-embed">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/CBbYbOni_Kg"
              title="Breastfeeding Tips"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Category 3: Maternity Health Tips */}
        <div className="video-category">
          <h3>Breastfeeding Tips</h3>
          <div className="video-embed">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/3jYYT_rf7Sw"
              title="Maternity Health Tips"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Category 4: Postpartum Fitness */}
        <div className="video-category">
          <h3>Lets Relax</h3>
          <div className="video-embed">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/GK_vRtHJZu4"
              title="Postpartum Fitness"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="resource-section">
        <h2>    News</h2>
        <div className="image-gallery">
          <div className="image-item">
            <a href="https://www.youtube.com/watch?v=lKx0sOz31C4" target="_blank" rel="noopener noreferrer">
              <img
                src={dep1}
                alt="Postpartum Support"
                className="resource-image"
              />
            </a>
            <p>Postpartum Support</p>
          </div>
          <div className="image-item">
            <a href="https://www.youtube.com/watch?v=3GTK6MLPJ9g" target="_blank" rel="noopener noreferrer">
              <img
                src={dep2}
                alt="Healthy Nutrition"
                className="resource-image"
              />
            </a>
            <p>Signs Of postpartum Depression</p>
          </div>
          <div className="image-item">
            <a href="https://www.youtube.com/watch?v=2ocA-zS3SoI&t=20s" target="_blank" rel="noopener noreferrer">
              <img
                src={dep3}
                alt="Maternity Health"
                className="resource-image"
              />
            </a>
            <p>Parenting Tips</p>
          </div>
          <div className="image-item">
            <a href="https://www.youtube.com/watch?v=f9NH2MJixjU&t=69s" target="_blank" rel="noopener noreferrer">
              <img
                src={dep4}
                alt="Breastfeeding Support"
                className="resource-image"
              />
            </a>
            <p>Baby's Health</p>
          </div>
          <div className="image-item">
            <a href="https://www.youtube.com/watch?v=CXWzqbe1i9c" target="_blank" rel="noopener noreferrer">
              <img
                src={dep5}
                alt="Mental Health"
                className="resource-image"
              />
            </a>
            <p>Maternal Health</p>
          </div>
          <div className="image-item">
            <a href="https://www.youtube.com/watch?v=lKx0sOz31C4" target="_blank" rel="noopener noreferrer">
              <img
                src={dep6}
                alt="Exercise after Birth"
                className="resource-image"
              />
            </a>
            <p>Reproductive health</p>
          </div>
          <div className="image-item">
            <a href="https://www.youtube.com/watch?v=3GTK6MLPJ9g" target="_blank" rel="noopener noreferrer">
              <img
                src={dep7}
                alt="Postpartum Fitness"
                className="resource-image"
              />
            </a>
            <p>Contraceptives</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
