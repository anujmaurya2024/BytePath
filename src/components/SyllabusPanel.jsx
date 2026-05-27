import React, { useState } from 'react';
import { SYLLABUS } from '../data/syllabus';
import { Download, Youtube, ExternalLink, FileText, Library } from 'lucide-react';

export default function SyllabusPanel({ uploadedPyqs }) {
  const [selectedSem, setSelectedSem] = useState(1);

  // Trigger base64 file downloads
  const downloadBase64File = (base64String, fileName) => {
    const link = document.createElement('a');
    link.href = base64String;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentSemData = SYLLABUS.find(sem => sem.semester === selectedSem) || SYLLABUS[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Semester selectors */}
      <div className="glass-card p-4 flex items-center justify-between flex-wrap gap-4 border border-slate-200 dark:border-indigo-950/20">
        <div className="flex items-center gap-2 flex-wrap">
          <Library size={16} className="text-indigo-500 mr-1" />
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mr-1">Select Semester:</span>
          <div className="flex gap-1.5 flex-wrap">
            {SYLLABUS.map(sem => (
              <button
                key={sem.semester}
                onClick={() => setSelectedSem(sem.semester)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedSem === sem.semester 
                    ? 'sem-btn-active' 
                    : 'sem-btn-inactive hover:border-indigo-500/20 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                Sem {sem.semester}
              </button>
            ))}
          </div>
        </div>
        <span className="text-xs text-slate-500 font-bold font-mono">
          Total Semester Credits: {currentSemData.totalCredits} cr
        </span>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentSemData.courses.map(course => {
          // Find custom resources uploaded for this course
          const customResources = uploadedPyqs.filter(r => r.courseCode === course.code);
          const youtubeLinks = customResources.filter(r => r.type === 'YouTube Link');
          const fileResources = customResources.filter(r => r.type !== 'YouTube Link');

          // YouTube search query url
          const dynamicYtQuery = `https://www.youtube.com/results?search_query=${encodeURIComponent(course.title + ' B.Tech CSE One Shot Lecture')}`;

          return (
            <div 
              key={course.code} 
              className="glass-card p-5 border border-slate-200 dark:border-indigo-950/20 flex flex-col justify-between hover:border-indigo-500/30 dark:hover:border-indigo-500/40 hover:scale-[1.01] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{course.code}</span>
                  <span className="badge bg-indigo-50/50 text-indigo-500 dark:text-indigo-400 border border-indigo-500/10 text-[9px]">
                    {course.type}
                  </span>
                </div>
                <h4 className="font-bold text-base leading-snug text-slate-800 dark:text-slate-200">{course.title}</h4>
                <p className="text-xs text-slate-500 mt-1">Course weighting: <strong className="text-slate-700 dark:text-slate-400">{course.credits} credits</strong></p>
              </div>

              {/* Resources Panel */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-indigo-950/15 space-y-4">
                
                {/* One shot lecture widget */}
                <div className="bg-slate-50 dark:bg-surface-700/20 p-3 rounded-xl border border-slate-150 dark:border-indigo-950/10 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tutorial Lectures</span>
                    <a 
                      href={dynamicYtQuery}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      <Youtube size={12} />
                      <span>YouTube One-Shot</span>
                    </a>
                  </div>

                  {/* Admin recommended YouTube links */}
                  {youtubeLinks.length > 0 && (
                    <div className="pt-2 border-t border-dashed border-slate-200 dark:border-indigo-950/20 space-y-1.5">
                      <p className="text-[10px] font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">Recommended Videos</p>
                      {youtubeLinks.map(vid => (
                        <a 
                          key={vid.id}
                          href={vid.fileData}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between bg-white dark:bg-surface-800 hover:bg-rose-50/20 dark:hover:bg-rose-950/10 p-2 rounded-lg border border-slate-100 dark:border-indigo-950/10 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors text-[11px] font-semibold"
                        >
                          <span className="truncate mr-2 flex items-center gap-1">
                            <ExternalLink size={10} className="shrink-0" />
                            {vid.title}
                          </span>
                          <span className="text-[9px] bg-rose-100 dark:bg-rose-950/20 px-1.5 py-0.5 rounded text-rose-600 dark:text-rose-400 font-bold shrink-0">Watch</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Default Prep Papers Mock */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Syllabus prep:</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert(`Downloading Mid-Sem prep materials for: ${course.title}`)}
                      className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-surface-700 dark:text-slate-300 dark:hover:bg-surface-600 text-slate-700 rounded-lg border border-slate-200/50 dark:border-surface-600/10 transition-colors cursor-pointer"
                    >
                      Mid-Sem File
                    </button>
                    <button 
                      onClick={() => alert(`Downloading End-Sem prep materials for: ${course.title}`)}
                      className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-surface-700 dark:text-slate-300 dark:hover:bg-surface-600 text-slate-700 rounded-lg border border-slate-200/50 dark:border-surface-600/10 transition-colors cursor-pointer"
                    >
                      End-Sem File
                    </button>
                  </div>
                </div>

                {/* Custom Admin Uploaded document papers */}
                {fileResources.length > 0 && (
                  <div className="space-y-2 pt-2.5 border-t border-dashed border-slate-200 dark:border-indigo-950/20">
                    <p className="text-[10px] font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">Uploaded PYQs & Papers</p>
                    <div className="flex flex-col gap-1.5">
                      {fileResources.map(res => (
                        <div 
                          key={res.id} 
                          className="flex items-center justify-between bg-indigo-50/20 dark:bg-indigo-950/10 p-2.5 rounded-xl border border-indigo-100/50 dark:border-indigo-950/20"
                        >
                          <div className="text-xs font-semibold text-slate-800 dark:text-slate-300 flex flex-col min-w-0 mr-2">
                            <span className="truncate flex items-center gap-1">
                              <FileText size={12} className="text-indigo-400 shrink-0" />
                              {res.title}
                            </span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono truncate">{res.fileName}</span>
                          </div>
                          <button 
                            onClick={() => downloadBase64File(res.fileData, res.fileName)}
                            className="px-2.5 py-1.5 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                          >
                            <Download size={10} /> Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
