"use client";

import { useEffect, useState } from "react";
import { FileText, ArrowUpRight } from "lucide-react";
import { useTranslation } from "../context";

interface Article {
  id: string;
  title: string;
  url: string;
  summary: string;
  category: string;
  publishedAt: string;
}

export default function Articles() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles")
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback mock data
        setArticles([
          {
            id: "1",
            title: "Insights & Innovation",
            url: "#",
            summary: "Latest news, technological updates, and success stories from the field.",
            category: "Tech",
            publishedAt: "2026-04-01"
          }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <section className="hero-band articles-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Geometric Angular Pattern Overlay — white effect */}
        <svg 
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '65%', height: '100%', opacity: 0.22, pointerEvents: 'none', zIndex: 0 }}
          viewBox="0 0 800 500" 
          preserveAspectRatio="xMaxYMid slice"
          fill="none"
        >
          <polygon points="150,0 800,0 800,500 300,500" fill="#ffffff" />
          <polygon points="250,0 800,0 800,350 500,500 350,250" fill="#ffffff" opacity="0.5" />
          <polygon points="500,0 800,0 800,250 600,320" fill="#ffffff" opacity="0.45" />
          <polygon points="50,250 350,50 650,250 450,500 100,450" fill="#ffffff" opacity="0.18" />
          <polygon points="450,80 800,30 800,420 550,500" fill="#ffffff" opacity="0.35" />
          <polygon points="600,0 800,0 800,180 680,220 620,100" fill="#ffffff" opacity="0.55" />
          <polygon points="300,0 550,0 500,200 280,180" fill="#ffffff" opacity="0.12" />
        </svg>

        <div className="container hero-band-inner" style={{ position: 'relative', zIndex: 1 }}>
          <div className="articles-hero-content">
            <div className="articles-hero-icon">
              <FileText size={48} />
            </div>
            <div className="articles-hero-text">
              <h1 className="hero-band-title">{t("articles.hero.title")}</h1>
              <p className="hero-band-subtitle">{t("articles.hero.subtitle")}</p>
              <div className="articles-stats">
                <div className="stat-item">
                  <span className="stat-number">{articles.length}</span>
                  <span className="stat-label">Articles</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">{new Date().getFullYear()}</span>
                  <span className="stat-label">Latest</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section articles-section">
        <div className="container">
          <div className="section-head">
            <div className="section-head-content">
              <h2 className="section-title">{t("articles.list.title")}</h2>
              <p className="section-subtitle">Explore our latest insights and technical articles</p>
            </div>
          </div>

          {!loading && articles.length > 0 ? (
            <div className="articles-grid">
              {articles.map((article) => (
                <article key={article.id} className="article-card">
                  <div className="article-card-header">
                    <div className="article-category">{article.category}</div>
                    {article.publishedAt && <time className="article-date">{article.publishedAt}</time>}
                  </div>
                  <div className="article-card-body">
                    <h3 className="article-title">
                      <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
                    </h3>
                    {article.summary && (
                      <p className="article-summary">{article.summary}</p>
                    )}
                  </div>
                  <div className="article-card-footer">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="article-link">
                      Read Article
                      <ArrowUpRight size={16} className="ml-1" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : !loading ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FileText size={64} />
              </div>
              <h3 className="empty-state-title">No Articles Yet</h3>
              <p className="empty-state-text">{t("list.empty")}</p>
            </div>
          ) : (
            <div className="text-center py-20">Loading articles...</div>
          )}
        </div>
      </section>
    </>
  );
}
