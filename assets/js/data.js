/* Sample data for the ADG demonstration prototype. All content is fictional sample content. */
window.DATA = (function(){
  const cats = [
    {id:"schemes",  name:"Government Schemes", hi:"सरकारी योजनाएं", icon:"🏛️", color:"#12355B"},
    {id:"health",   name:"Health & Wellness",  hi:"स्वास्थ्य",       icon:"🩺", color:"#1F8A70"},
    {id:"edu",      name:"Education & Skills", hi:"शिक्षा और कौशल",  icon:"🎓", color:"#2F6DB5"},
    {id:"agri",     name:"Agriculture",        hi:"कृषि",            icon:"🌾", color:"#6B8E23"},
    {id:"culture",  name:"Culture & Heritage", hi:"संस्कृति",        icon:"🪔", color:"#E8871E"},
    {id:"digital",  name:"Digital India",      hi:"डिजिटल इंडिया",   icon:"💻", color:"#5B3FA6"},
    {id:"women",    name:"Women & Child",      hi:"महिला एवं बाल",   icon:"👧", color:"#C2185B"},
    {id:"env",      name:"Environment",        hi:"पर्यावरण",        icon:"🌳", color:"#2E7D32"},
  ];
  const langs = ["English","Hindi","Tamil","Bengali","Marathi","Telugu"];
  const T = [
    ["How the Digital Literacy Mission reaches villages","schemes","Hindi","08:42",128400,"2026-10-28"],
    ["Ayushman card in five simple steps","health","English","04:15",96210,"2026-10-25"],
    ["Skill India: from classroom to job","edu","English","11:03",70120,"2026-10-22"],
    ["Natural farming: success stories","agri","Hindi","09:30",54180,"2026-10-20"],
    ["Dance forms of India: Kathak","culture","English","14:20",88300,"2026-10-18"],
    ["UPI explained for first-time users","digital","Hindi","03:48",212400,"2026-10-16"],
    ["Beti Bachao, Beti Padhao: ground reports","women","Hindi","12:11",61200,"2026-10-14"],
    ["Clean rivers: the Namami Gange story","env","English","10:25",47890,"2026-10-12"],
    ["Poshan Abhiyaan: nutrition basics","health","Bengali","06:40",33100,"2026-10-10"],
    ["Mudra loans: who can apply","schemes","Tamil","05:55",41650,"2026-10-08"],
    ["Kisan credit card made easy","agri","Marathi","07:12",38400,"2026-10-06"],
    ["Digilocker: your documents, safe","digital","English","04:02",119800,"2026-10-04"],
    ["Handlooms of Bengal","culture","Bengali","13:38",29900,"2026-10-02"],
    ["Solar rooftop subsidy: step by step","env","Hindi","08:05",66700,"2026-09-30"],
    ["Mission Shakti: women entrepreneurs","women","Telugu","09:48",27400,"2026-09-28"],
    ["Exam preparation with free digital tools","edu","Hindi","10:10",52300,"2026-09-26"],
    ["Yoga for a healthy workplace","health","English","15:00",143900,"2026-09-24"],
    ["PM Awas Yojana: eligibility explained","schemes","Hindi","06:22",75500,"2026-09-22"],
    ["Temple architecture of the South","culture","Tamil","16:45",31800,"2026-09-20"],
    ["Cyber safety for senior citizens","digital","English","07:36",58800,"2026-09-18"],
    ["Millets: the super grain","agri","English","05:18",44200,"2026-09-16"],
    ["Scholarships you may not know about","edu","English","06:50",83900,"2026-09-14"],
    ["Anganwadi: early childhood care","women","Marathi","08:20",22100,"2026-09-12"],
    ["Plastic-free campuses","env","Telugu","04:44",19700,"2026-09-10"],
  ];
  const videos = T.map((t,i)=>{
    const c = cats.find(x=>x.id===t[1]);
    return {id:i+1,title:t[0],cat:t[1],catName:c.name,lang:t[2],dur:t[3],views:t[4],date:t[5],color:c.color,icon:c.icon,
      src:"assets/media/sample.mp4",
      desc:"A short explainer from the New Media Wing sample library. Sample content for demonstration only; it shows how a video page, metadata and sharing options work on the portal.",
      tags:[c.name.split(" ")[0].toLowerCase(),t[2].toLowerCase(),"explainer"]};
  });
  const stations = [
    ["Radio Hill Voice","Meghalaya","Khasi"],["Kisan Vani","Madhya Pradesh","Hindi"],["Coastal Awaaz","Kerala","Malayalam"],
    ["Desert Echo","Rajasthan","Marwari"],["Brahmaputra FM","Assam","Assamese"],["Sahyadri Samvad","Maharashtra","Marathi"],
    ["Cauvery Community Radio","Karnataka","Kannada"],["Gram Swar","Uttar Pradesh","Hindi"],["Sundarban Betar","West Bengal","Bengali"],
    ["Nilgiri Kural","Tamil Nadu","Tamil"],["Himalayan Pulse","Uttarakhand","Garhwali"],["Konkan Tarang","Goa","Konkani"],
  ].map((s,i)=>({id:i+1,name:s[0],state:s[1],lang:s[2],episodes:20+((i*37)%180),hours:12+((i*53)%140),status:i%5===3?"Pending":"Live"}));
  const episodes = [
    ["Water saving in our fields","Kisan Vani","Hindi","22:10","Agriculture"],
    ["Voices of weavers","Sundarban Betar","Bengali","18:45","Culture"],
    ["Vaccination drive diary","Coastal Awaaz","Malayalam","25:30","Health"],
    ["Girls in science","Radio Hill Voice","Khasi","16:20","Education"],
    ["Folk songs of the desert","Desert Echo","Marwari","28:00","Culture"],
    ["Monsoon preparedness","Konkan Tarang","Konkani","19:15","Environment"],
    ["Millets recipes","Nilgiri Kural","Tamil","21:40","Health"],
    ["Digital payments at the haat","Gram Swar","Hindi","17:05","Digital India"],
  ].map((e,i)=>({id:i+1,title:e[0],station:e[1],lang:e[2],dur:e[3],theme:e[4]}));
  const awardCats = ["Best Social Impact","Best Women-led Station","Best Programme in Local Language","Best Innovation in Community Engagement"];
  const awards = [
    {id:"A-101",station:"Kisan Vani",cat:awardCats[0],date:"2026-10-30",status:"Submitted",docs:3},
    {id:"A-102",station:"Coastal Awaaz",cat:awardCats[2],date:"2026-10-29",status:"Under review",docs:4},
    {id:"A-103",station:"Gram Swar",cat:awardCats[1],date:"2026-10-27",status:"Approved",docs:3},
    {id:"A-104",station:"Konkan Tarang",cat:awardCats[3],date:"2026-10-26",status:"Submitted",docs:2},
    {id:"A-105",station:"Radio Hill Voice",cat:awardCats[0],date:"2026-10-24",status:"Returned",docs:1},
  ];
  const psas = [
    ["Smoking harms: spread the word","Anti-tobacco","2026-12-31","Active"],
    ["Road safety: wear a helmet","Road safety","2026-12-31","Active"],
    ["Say no to piracy","Anti-piracy","2027-03-31","Active"],
    ["Clean India pledge","Swachhta","2026-11-30","Expiring"],
    ["Organ donation awareness","Health","2027-01-31","Active"],
    ["Cyber crime helpline 1930","Cyber safety","2026-10-15","Archived"],
  ].map((p,i)=>({id:"PSA-"+(201+i),title:p[0],topic:p[1],validTill:p[2],status:p[3]}));
  const exhibitors = [
    ["Metro Cineplex, Delhi","North","Confirmed",98],["Star Screens, Mumbai","West","Confirmed",95],["Lotus Theatres, Kolkata","East","Pending",72],
    ["Southern Cinemas, Chennai","South","Confirmed",91],["Orion Multiplex, Pune","West","Pending",68],["Capital Talkies, Bhopal","Central","Confirmed",89],
    ["Riverfront Cinema, Guwahati","North-East","Pending",60],["Gateway Screens, Kochi","South","Confirmed",93],
  ].map((e,i)=>({id:i+1,name:e[0],region:e[1],status:e[2],score:e[3]}));
  const months = ["Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"];
  const analytics = {
    months,
    visits:[310,334,352,380,402,431,455,470,498,520,548,577].map(x=>x*1000),
    streams:[210,226,241,262,280,301,322,331,355,372,396,418].map(x=>x*1000),
    downloads:[48,52,55,61,64,70,73,76,81,85,90,96].map(x=>x*1000),
    uptime:[99.92,99.88,99.95,99.71,99.9,99.97,99.86,99.93,99.64,99.91,99.96,99.89],
    hitCounter: 6248391,
    devices:[["Mobile",64],["Desktop",29],["Tablet",7]],
    languages:[["Hindi",38],["English",34],["Tamil",8],["Bengali",7],["Marathi",7],["Telugu",6]],
    states:[["Uttar Pradesh",14.2],["Maharashtra",11.6],["Tamil Nadu",9.8],["Delhi",8.9],["West Bengal",8.1],["Karnataka",7.3]],
  };
  const incidents = [
    {id:"INC-2411",sev:"S1",title:"Video playback errors on one CDN region",opened:"2026-11-03 09:12",resolved:"2026-11-03 09:58",mins:46,status:"Resolved",owner:"Cloud/DevOps"},
    {id:"INC-2412",sev:"S2",title:"Search latency above threshold",opened:"2026-11-07 14:30",resolved:"2026-11-07 17:05",mins:155,status:"Resolved",owner:"Back-end"},
    {id:"INC-2413",sev:"S3",title:"Thumbnail cache not refreshing",opened:"2026-11-09 11:00",resolved:"2026-11-10 10:00",mins:1380,status:"Resolved",owner:"Front-end"},
    {id:"INC-2414",sev:"S2",title:"CMS upload timeouts for large files",opened:"2026-11-12 16:20",resolved:"",mins:0,status:"In progress",owner:"Back-end"},
    {id:"INC-2415",sev:"S4",title:"Footer link text correction",opened:"2026-11-13 10:15",resolved:"",mins:0,status:"Open",owner:"Front-end"},
  ];
  const sla = [["Severity 1","Critical outage","30 min","4 h",46],["Severity 2","Major degradation","2 h","8 h",155],["Severity 3","Minor issue","8 h","2 days",1380],["Severity 4","Cosmetic","1 day","5 days",0]];
  const users = [
    {id:"U-1",name:"Anita Rao",role:"Super Admin",email:"superadmin@demo.adg",password:"Demo@1234",status:"Active",created:"2026-09-01",last:"2026-11-15 18:02"},
    {id:"U-2",name:"Vikram Singh",role:"Inputter",email:"inputter@demo.adg",password:"Demo@1234",status:"Active",created:"2026-09-01",last:"2026-11-15 17:41"},
    {id:"U-3",name:"Meera Joshi",role:"Approver",email:"approver@demo.adg",password:"Demo@1234",status:"Active",created:"2026-09-01",last:"2026-11-15 17:05"},
  ];
  return {cats,langs,videos,stations,episodes,awardCats,awards,psas,exhibitors,analytics,incidents,sla,users};
})();
