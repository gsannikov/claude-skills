// Summary Base Component - Compact list/overview template
// Used for: Recipe lists, job backlog, idea summaries

export default function SummaryPreview({ data, theme, mapping }) {
  const themes = {
    cooking: {
      gradient: "from-orange-500 to-red-500",
      bgPage: "from-orange-50 to-red-50",
      accent: "orange",
      hoverBg: "hover:bg-orange-50"
    },
    professional: {
      gradient: "from-blue-600 to-cyan-500",
      bgPage: "from-slate-50 to-blue-50",
      accent: "blue",
      hoverBg: "hover:bg-blue-50"
    },
    finance: {
      gradient: "from-emerald-600 to-teal-500",
      bgPage: "from-emerald-50 to-teal-50",
      accent: "emerald",
      hoverBg: "hover:bg-emerald-50"
    },
    creative: {
      gradient: "from-purple-600 to-pink-500",
      bgPage: "from-purple-50 to-pink-50",
      accent: "purple",
      hoverBg: "hover:bg-purple-50"
    },
    neutral: {
      gradient: "from-gray-600 to-gray-500",
      bgPage: "from-gray-50 to-slate-50",
      accent: "gray",
      hoverBg: "hover:bg-gray-50"
    }
  };

  const t = themes[theme] || themes.neutral;
  const isRTL = mapping?.rtl === true;
  
  const header = mapping?.header || {};
  const listConfig = mapping?.list_item || {};
  const items = data?.items || data || [];
  const footer = mapping?.footer || {};

  const getValue = (obj, path) => {
    if (!path) return null;
    return path.split('.').reduce((o, k) => o?.[k], obj);
  };

  const renderRating = (rating, max = 5) => {
    if (!rating) return null;
    return "⭐".repeat(Math.min(rating, max));
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "text-green-600 bg-green-100";
    if (score >= 50) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getBadgeColor = (value, colorMap) => {
    if (colorMap?.[value]) return colorMap[value];
    const defaults = {
      "First": "bg-green-500 text-white",
      "Second": "bg-yellow-500 text-black",
      "Third": "bg-red-500 text-white",
      "Perfected": "bg-purple-100 text-purple-800",
      "To try": "bg-amber-100 text-amber-800",
      "Tried": "bg-green-100 text-green-800"
    };
    return defaults[value] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${t.bgPage} p-4`}>
      <div 
        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${t.gradient} p-5 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {header.icon && <span className="text-3xl">{header.icon}</span>}
              <div>
                <h1 className="text-2xl font-bold">{header.title}</h1>
                {header.subtitle && (
                  <p className="text-sm opacity-80">{header.subtitle}</p>
                )}
              </div>
            </div>
            {header.badge && (
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {items.length} {header.badge}
              </span>
            )}
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-100">
          {items.map((item, i) => (
            <div 
              key={i} 
              className={`p-4 ${t.hoverBg} transition-colors cursor-pointer flex items-center gap-4`}
            >
              {/* Icon */}
              {listConfig.icon && (
                <span className="text-3xl flex-shrink-0">
                  {getValue(item, listConfig.icon) || "📄"}
                </span>
              )}
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {getValue(item, listConfig.title) || item.name || item.title}
                  </h3>
                  {listConfig.rating && (
                    <span className="text-sm">
                      {renderRating(getValue(item, listConfig.rating))}
                    </span>
                  )}
                </div>
                {listConfig.subtitle && (
                  <p className="text-sm text-gray-500 truncate">
                    {getValue(item, listConfig.subtitle)}
                  </p>
                )}
                
                {/* Badges */}
                {listConfig.badges && (
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {listConfig.badges.map((badge, j) => {
                      const value = getValue(item, badge.field || badge);
                      if (!value) return null;
                      return (
                        <span 
                          key={j} 
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(value, badge.color_map)}`}
                        >
                          {value}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Score (if applicable) */}
              {listConfig.score && (
                <div className={`px-3 py-1 rounded-lg font-bold ${getScoreColor(getValue(item, listConfig.score))}`}>
                  {getValue(item, listConfig.score)}
                </div>
              )}

              {/* Arrow */}
              <span className="text-gray-300 text-xl">→</span>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <span className="text-4xl block mb-2">📭</span>
            No items to display
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
          <span className="text-sm text-gray-500">
            Total: {items.length} items
          </span>
          {footer.action && (
            <button className={`px-4 py-2 bg-gradient-to-r ${t.gradient} text-white rounded-lg text-sm font-medium`}>
              {footer.action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
