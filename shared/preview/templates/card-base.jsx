// Card Base Component - Universal card preview template
// Used for: Recipes, single job postings, ideas, items

export default function CardPreview({ data, theme, mapping }) {
  // Theme defaults
  const themes = {
    cooking: {
      gradient: "from-orange-500 via-red-500 to-pink-500",
      bgPage: "from-orange-50 to-red-50",
      accent: "orange",
      bulletColor: "bg-orange-500"
    },
    professional: {
      gradient: "from-blue-600 via-blue-500 to-cyan-500",
      bgPage: "from-blue-50 to-slate-50",
      accent: "blue",
      bulletColor: "bg-blue-500"
    },
    finance: {
      gradient: "from-emerald-600 via-teal-500 to-cyan-500",
      bgPage: "from-emerald-50 to-teal-50",
      accent: "emerald",
      bulletColor: "bg-emerald-500"
    },
    creative: {
      gradient: "from-purple-600 via-pink-500 to-rose-500",
      bgPage: "from-purple-50 to-pink-50",
      accent: "purple",
      bulletColor: "bg-purple-500"
    },
    neutral: {
      gradient: "from-gray-700 via-gray-600 to-gray-500",
      bgPage: "from-gray-50 to-slate-50",
      accent: "gray",
      bulletColor: "bg-gray-500"
    }
  };

  const t = themes[theme] || themes.neutral;
  const isRTL = mapping?.rtl !== false;

  // Extract data based on mapping
  const header = mapping?.header || {};
  const quickStats = mapping?.quick_stats || [];
  const sections = mapping?.sections || [];
  const footer = mapping?.footer || {};

  // Helper to get nested value
  const getValue = (obj, path) => {
    if (!path) return null;
    return path.split('.').reduce((o, k) => o?.[k], obj);
  };

  // Render rating stars
  const renderRating = (rating, max = 5) => {
    if (!rating) return null;
    return "⭐".repeat(Math.min(rating, max));
  };

  // Render badge
  const renderBadge = (badge, colorMap) => {
    const colors = {
      amber: "bg-amber-100 text-amber-800 border-amber-300",
      blue: "bg-blue-100 text-blue-800 border-blue-300",
      green: "bg-green-100 text-green-800 border-green-300",
      purple: "bg-purple-100 text-purple-800 border-purple-300",
      red: "bg-red-100 text-red-800 border-red-300",
      gray: "bg-gray-100 text-gray-800 border-gray-300"
    };
    const color = colorMap?.[badge] || "gray";
    return (
      <span className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 ${colors[color]}`}>
        {badge}
      </span>
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${t.bgPage} p-4`}>
      <div 
        className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${t.gradient} p-8 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative flex items-center gap-6">
            {header.icon && (
              <div className="text-8xl drop-shadow-lg">
                {getValue(data, header.icon) || header.icon}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3">
                {getValue(data, header.title) || header.title}
              </h1>
              {header.subtitle && (
                <p className="text-xl opacity-90 mb-2">
                  {getValue(data, header.subtitle) || header.subtitle}
                </p>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                {header.badges?.map((badge, i) => {
                  const value = typeof badge === 'string' 
                    ? getValue(data, badge) 
                    : getValue(data, badge.field);
                  const colorMap = badge.color_map;
                  return value ? (
                    <span key={i} className="bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium">
                      {value}
                    </span>
                  ) : null;
                })}
                {header.rating && (
                  <span className="text-xl tracking-wider">
                    {renderRating(getValue(data, header.rating.field || header.rating), header.rating.max)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        {quickStats.length > 0 && (
          <div className={`grid grid-cols-${quickStats.length} py-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200`}>
            {quickStats.map((stat, i) => {
              const value = getValue(data, stat.field);
              if (!value) return null;
              return (
                <div key={i} className={`text-center ${i < quickStats.length - 1 ? 'border-l border-gray-300' : ''}`}>
                  <div className="text-3xl mb-1">{stat.icon}</div>
                  <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                  <div className="font-bold text-gray-800">{value}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sections */}
        <div className="p-8 space-y-6">
          {sections.map((section, i) => {
            const items = getValue(data, section.field) || [];
            
            // Skip empty sections unless explicitly shown
            if (section.condition) {
              try {
                const conditionMet = eval(section.condition.replace(/(\w+)/g, (m) => {
                  const val = getValue(data, m);
                  return JSON.stringify(val);
                }));
                if (!conditionMet) return null;
              } catch {
                if (!items || items.length === 0) return null;
              }
            }
            
            if (!items || (Array.isArray(items) && items.length === 0)) return null;

            switch (section.type) {
              case 'tag_list':
                return (
                  <div key={i} className={`px-0 py-4 bg-${section.color || 'blue'}-50 -mx-8 px-8 flex items-center gap-3 flex-wrap border-b-2 border-${section.color || 'blue'}-100`}>
                    {section.icon && <span className={`text-${section.color || 'blue'}-700 font-bold text-lg`}>{section.icon}</span>}
                    {section.title && <span className={`text-${section.color || 'blue'}-700 font-medium`}>{section.title}:</span>}
                    {items.map((item, j) => (
                      <span key={j} className={`bg-${section.color || 'blue'}-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm`}>
                        {item}
                      </span>
                    ))}
                  </div>
                );

              case 'bullet_list':
                return (
                  <div key={i}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                      {section.icon && <span className={`bg-${section.bullet_color || 'green'}-100 p-2 rounded-xl`}>{section.icon}</span>}
                      {section.title}
                    </h2>
                    <div className="grid grid-cols-1 gap-2">
                      {items.map((item, j) => (
                        <div key={j} className={`flex items-center gap-3 bg-gradient-to-l from-${section.bullet_color || 'green'}-50 to-transparent p-3 rounded-xl`}>
                          <span className={`w-3 h-3 ${t.bulletColor} rounded-full flex-shrink-0`}></span>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );

              case 'numbered_steps':
                return (
                  <div key={i}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                      {section.icon && <span className={`bg-${t.accent}-100 p-2 rounded-xl`}>{section.icon}</span>}
                      {section.title}
                    </h2>
                    <div className="space-y-4">
                      {items.map((step, j) => (
                        <div key={j} className="flex gap-4 items-start">
                          <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-br ${t.gradient} text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg`}>
                            {j + 1}
                          </div>
                          <p className="pt-2 text-gray-700 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );

              case 'callout':
                const calloutStyles = {
                  warning: "bg-yellow-50 border-r-4 border-yellow-400",
                  info: "bg-blue-50 border-r-4 border-blue-400",
                  success: "bg-green-50 border-r-4 border-green-400",
                  error: "bg-red-50 border-r-4 border-red-400"
                };
                return (
                  <div key={i} className={`${calloutStyles[section.style] || calloutStyles.info} p-4 rounded-lg`}>
                    {section.title && (
                      <h3 className="font-bold mb-2 flex items-center gap-2">
                        {section.icon} {section.title}
                      </h3>
                    )}
                    {Array.isArray(items) ? (
                      <ul className="space-y-1">
                        {items.map((note, j) => (
                          <li key={j}>{note}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{items}</p>
                    )}
                  </div>
                );

              default:
                return null;
            }
          })}

          {/* Footer Tags */}
          {footer.tags && (
            <div className="flex gap-2 flex-wrap pt-6 border-t-2 border-gray-100">
              {(getValue(data, footer.tags.field) || []).map((tag, i) => (
                <span key={i} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
                  {footer.tags.prefix || '#'}{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Brand */}
        {footer.brand && (
          <div className="bg-gray-50 px-8 py-4 text-center text-gray-400 text-sm border-t">
            {footer.brand}
          </div>
        )}
      </div>
    </div>
  );
}
