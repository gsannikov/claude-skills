// Timeline Base Component - Step-by-step/chronological template
// Used for: Preparation plans, interview prep, project workflows

export default function TimelinePreview({ data, theme, mapping }) {
  const themes = {
    cooking: {
      gradient: "from-orange-500 to-red-500",
      bgPage: "from-orange-50 to-red-50",
      lineColor: "bg-orange-300",
      dotActive: "bg-orange-500",
      dotComplete: "bg-green-500"
    },
    professional: {
      gradient: "from-blue-600 to-cyan-500",
      bgPage: "from-slate-50 to-blue-50",
      lineColor: "bg-blue-200",
      dotActive: "bg-blue-500",
      dotComplete: "bg-green-500"
    },
    finance: {
      gradient: "from-emerald-600 to-teal-500",
      bgPage: "from-emerald-50 to-teal-50",
      lineColor: "bg-emerald-200",
      dotActive: "bg-emerald-500",
      dotComplete: "bg-green-500"
    },
    creative: {
      gradient: "from-purple-600 to-pink-500",
      bgPage: "from-purple-50 to-pink-50",
      lineColor: "bg-purple-200",
      dotActive: "bg-purple-500",
      dotComplete: "bg-green-500"
    },
    neutral: {
      gradient: "from-gray-600 to-gray-500",
      bgPage: "from-gray-50 to-slate-50",
      lineColor: "bg-gray-200",
      dotActive: "bg-gray-500",
      dotComplete: "bg-green-500"
    }
  };

  const t = themes[theme] || themes.professional;
  const isRTL = mapping?.rtl === true;
  
  const header = mapping?.header || {};
  const stepConfig = mapping?.step || {};
  const steps = data?.steps || data?.items || data || [];
  const footer = mapping?.footer || {};

  const getValue = (obj, path) => {
    if (!path) return null;
    return path.split('.').reduce((o, k) => o?.[k], obj);
  };

  const getStepStatus = (step, index, currentIndex) => {
    if (step.status === 'complete' || index < currentIndex) return 'complete';
    if (step.status === 'current' || index === currentIndex) return 'current';
    return 'pending';
  };

  const currentStepIndex = steps.findIndex(s => s.status === 'current' || s.current);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${t.bgPage} p-4`}>
      <div 
        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${t.gradient} p-6 text-white`}>
          <div className="flex items-center gap-4">
            {header.icon && <span className="text-4xl">{header.icon}</span>}
            <div>
              <h1 className="text-2xl font-bold">{header.title || "Timeline"}</h1>
              {header.subtitle && (
                <p className="text-sm opacity-80 mt-1">{header.subtitle}</p>
              )}
            </div>
          </div>
          
          {/* Progress indicator */}
          {header.showProgress !== false && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{Math.max(0, currentStepIndex + 1)} / {steps.length}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="p-6">
          <div className="relative">
            {/* Vertical line */}
            <div className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-0 bottom-0 w-0.5 ${t.lineColor}`}></div>
            
            {/* Steps */}
            <div className="space-y-6">
              {steps.map((step, i) => {
                const status = getStepStatus(step, i, currentStepIndex);
                
                return (
                  <div key={i} className={`relative ${isRTL ? 'pr-12' : 'pl-12'}`}>
                    {/* Dot */}
                    <div className={`absolute ${isRTL ? 'right-2' : 'left-2'} w-5 h-5 rounded-full border-4 border-white shadow-md ${
                      status === 'complete' ? t.dotComplete :
                      status === 'current' ? `${t.dotActive} ring-4 ring-blue-100` :
                      'bg-gray-300'
                    }`}>
                      {status === 'complete' && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</span>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className={`p-4 rounded-xl ${
                      status === 'current' ? 'bg-blue-50 border-2 border-blue-200' :
                      status === 'complete' ? 'bg-green-50' :
                      'bg-gray-50'
                    }`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {step.icon && <span className="text-xl">{step.icon}</span>}
                            <h3 className={`font-semibold ${
                              status === 'current' ? 'text-blue-800' :
                              status === 'complete' ? 'text-green-800' :
                              'text-gray-700'
                            }`}>
                              {getValue(step, stepConfig.title) || step.title || step.name}
                            </h3>
                          </div>
                          
                          {(getValue(step, stepConfig.description) || step.description) && (
                            <p className="text-gray-600 mt-1 text-sm">
                              {getValue(step, stepConfig.description) || step.description}
                            </p>
                          )}
                          
                          {/* Sub-items */}
                          {step.items && step.items.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {step.items.map((item, j) => (
                                <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    status === 'complete' ? 'bg-green-500' : 'bg-gray-400'
                                  }`}></span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        
                        {/* Duration/time */}
                        {(step.duration || step.time) && (
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            status === 'current' ? 'bg-blue-200 text-blue-800' :
                            status === 'complete' ? 'bg-green-200 text-green-800' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {step.duration || step.time}
                          </span>
                        )}
                      </div>
                      
                      {/* Status badge */}
                      {status === 'current' && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                          </span>
                          <span className="text-sm font-medium text-blue-600">In Progress</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {steps.filter(s => getStepStatus(s, steps.indexOf(s), currentStepIndex) === 'complete').length} of {steps.length} complete
            </div>
            {footer.totalTime && (
              <div className="text-sm font-medium text-gray-700">
                ⏱️ Total: {footer.totalTime}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
