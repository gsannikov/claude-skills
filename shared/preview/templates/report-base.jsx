// Report Base Component - Multi-section report template
// Used for: Job analysis, research summaries, detailed comparisons

export default function ReportPreview({ data, theme, mapping }) {
  const themes = {
    cooking: {
      gradient: "from-orange-500 via-red-500 to-pink-500",
      bgPage: "from-orange-50 to-red-50",
      accent: "orange",
      scoreColor: "bg-orange-500"
    },
    professional: {
      gradient: "from-blue-600 via-blue-500 to-cyan-500",
      bgPage: "from-slate-100 to-blue-50",
      accent: "blue",
      scoreColor: "bg-blue-500"
    },
    finance: {
      gradient: "from-emerald-600 via-teal-500 to-cyan-500",
      bgPage: "from-emerald-50 to-teal-50",
      accent: "emerald",
      scoreColor: "bg-emerald-500"
    },
    creative: {
      gradient: "from-purple-600 via-pink-500 to-rose-500",
      bgPage: "from-purple-50 to-pink-50",
      accent: "purple",
      scoreColor: "bg-purple-500"
    },
    neutral: {
      gradient: "from-gray-700 via-gray-600 to-gray-500",
      bgPage: "from-gray-100 to-slate-50",
      accent: "gray",
      scoreColor: "bg-gray-500"
    }
  };

  const t = themes[theme] || themes.professional;
  const isRTL = mapping?.rtl === true;

  const getValue = (obj, path) => {
    if (!path) return null;
    return path.split('.').reduce((o, k) => o?.[k], obj);
  };

  const header = mapping?.header || {};
  const scoreBar = mapping?.score_bar || null;
  const sections = mapping?.sections || [];

  // Score color based on value
  const getScoreColor = (score, max = 100) => {
    const pct = (score / max) * 100;
    if (pct >= 70) return "bg-green-500";
    if (pct >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Priority badge color
  const getPriorityColor = (priority) => {
    const colors = {
      "First": "bg-green-500 text-white",
      "Second": "bg-yellow-500 text-black",
      "Third": "bg-red-500 text-white",
      "High": "bg-green-500 text-white",
      "Medium": "bg-yellow-500 text-black",
      "Low": "bg-gray-400 text-white"
    };
    return colors[priority] || "bg-gray-200 text-gray-800";
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${t.bgPage} p-4`}>
      <div 
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${t.gradient} p-6 text-white`}>
          <div className="flex items-start gap-4">
            {header.icon && (
              <div className="text-5xl">{getValue(data, header.icon) || header.icon}</div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                {getValue(data, header.title) || header.title}
              </h1>
              {header.subtitle && (
                <p className="text-xl opacity-90 mt-1">
                  {getValue(data, header.subtitle) || header.subtitle}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {header.badges?.map((badge, i) => {
                  const value = typeof badge === 'string' 
                    ? getValue(data, badge) 
                    : getValue(data, badge.field);
                  if (!value) return null;
                  return (
                    <span key={i} className={`px-3 py-1 rounded-full text-sm font-bold ${
                      badge.type === 'priority' ? getPriorityColor(value) : 'bg-white/20'
                    }`}>
                      {badge.prefix || ''}{value}{badge.suffix || ''}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Score Bar */}
        {scoreBar && (
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-gray-700">
                {scoreBar.title || "Overall Score"}
              </span>
              <span className="text-3xl font-black text-gray-800">
                {getValue(data, scoreBar.total)}<span className="text-lg text-gray-400">/{scoreBar.max || 100}</span>
              </span>
            </div>
            
            {/* Main score bar */}
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div 
                className={`h-full ${getScoreColor(getValue(data, scoreBar.total))} rounded-full transition-all`}
                style={{ width: `${(getValue(data, scoreBar.total) / (scoreBar.max || 100)) * 100}%` }}
              />
            </div>

            {/* Breakdown */}
            {scoreBar.breakdown && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {scoreBar.breakdown.map((item, i) => {
                  const score = getValue(data, item.field) || item.score;
                  if (score === null || score === undefined) return null;
                  return (
                    <div key={i} className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">{item.name}</span>
                        <span className="font-bold text-gray-800">{score}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${item.color || 'blue'}-500 rounded-full`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Content Sections */}
        <div className="p-6 space-y-6">
          {sections.map((section, i) => {
            switch (section.type) {
              case 'pros_cons':
                const pros = getValue(data, section.pros_field) || [];
                const cons = getValue(data, section.cons_field) || [];
                if (pros.length === 0 && cons.length === 0) return null;
                
                return (
                  <div key={i} className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                        ✅ {section.pros_title || "Pros"}
                      </h3>
                      <ul className="space-y-2">
                        {pros.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-green-700">
                            <span className="text-green-500 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                      <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                        ⚠️ {section.cons_title || "Cons"}
                      </h3>
                      <ul className="space-y-2">
                        {cons.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-red-700">
                            <span className="text-red-500 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );

              case 'action_items':
                const actions = getValue(data, section.field) || [];
                if (actions.length === 0) return null;
                
                return (
                  <div key={i} className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                      {section.icon || "📋"} {section.title || "Next Steps"}
                    </h3>
                    <ul className="space-y-2">
                      {actions.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-blue-900">
                          <span className="w-5 h-5 border-2 border-blue-400 rounded mt-0.5 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );

              case 'key_value':
                return (
                  <div key={i} className="bg-gray-50 p-4 rounded-xl">
                    {section.title && (
                      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        {section.icon} {section.title}
                      </h3>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      {section.fields?.map((field, j) => {
                        const value = getValue(data, field.field);
                        if (!value) return null;
                        return (
                          <div key={j} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                            <span className="text-gray-600">{field.label}</span>
                            <span className="font-semibold text-gray-800">{value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );

              case 'text_block':
                const text = getValue(data, section.field);
                if (!text) return null;
                
                return (
                  <div key={i}>
                    {section.title && (
                      <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        {section.icon} {section.title}
                      </h3>
                    )}
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                      {text}
                    </p>
                  </div>
                );

              case 'bullet_list':
                const items = getValue(data, section.field) || [];
                if (items.length === 0) return null;
                
                return (
                  <div key={i}>
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      {section.icon} {section.title}
                    </h3>
                    <ul className="space-y-2 bg-gray-50 p-4 rounded-xl">
                      {items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-gray-700">
                          <span className={`w-2 h-2 ${t.scoreColor} rounded-full mt-2 flex-shrink-0`}></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-4 text-center text-gray-500 text-sm border-t">
          {mapping?.footer?.brand || "Generated by Claude Skills"}
        </div>
      </div>
    </div>
  );
}
