const pairQuestions = [
[1,'AR','遇到事情卡住時，我通常會主動尋找突破的方法。','遇到事情卡住時，我通常會先等待情勢變得更明朗。'],
[2,'IE','即使外在條件沒有明顯問題，我也容易因為想太多而停下來。','即使我已經準備好，外在的人事物仍常讓事情無法推進。'],
[3,'WL','工作或收入不穩定時，我很難真正放鬆。','感情或人際不穩定時，我很難真正放鬆。'],
[4,'BS','我的狀況經常一下變好、一下又出現問題。','我的狀況長時間沒有明顯變化或進展。'],
[5,'AR','當一段關係不明確時，我傾向主動確認對方的想法。','當一段關係不明確時，我傾向觀察對方接下來的行動。'],
[6,'IE','過去的失敗或受傷經驗，會影響我現在的判斷。','別人的態度、要求或限制，會影響我現在的選擇。'],
[7,'WL','現階段，我最想改善的是工作、事業或財務狀況。','現階段，我最想改善的是感情、人際或家庭關係。'],
[8,'BS','我並不是沒有機會，而是很難把好的狀態維持下去。','我已經等待很久，卻始終等不到真正的機會。'],
[9,'AR','即使沒有十足把握，我也願意先嘗試再調整。','我通常要確認風險較低後，才願意開始行動。'],
[10,'IE','我最常需要克服的是自己的焦慮與不確定感。','我最常需要克服的是環境與他人帶來的阻力。'],
[11,'WL','得到實際成果與收入，最能帶給我安全感。','得到理解、陪伴與支持，最能帶給我安全感。'],
[12,'BS','我的問題通常來自生活各方面互相影響、難以平衡。','我的問題通常來自某件事一直卡住、無法繼續前進。'],
[13,'AR','面對不滿意的現況，我通常會很快做出改變。','面對不滿意的現況，我通常會再忍耐或觀察一段時間。'],
[14,'IE','事情不順時，我常懷疑是不是自己不夠好。','事情不順時，我常覺得是條件、時機或合作對象不配合。'],
[15,'WL','當事業順利時，我會覺得其他事情也比較容易處理。','當關係順利時，我會覺得其他事情也比較容易處理。'],
[16,'BS','我常在充滿動力與非常疲累之間反覆擺盪。','我常覺得無論怎麼努力，都像停留在同一個位置。'],
[17,'AR','機會出現時，我比較擔心自己沒有及時把握。','機會出現時，我比較擔心自己判斷得太快。'],
[18,'IE','我的情緒狀態，會明顯影響工作與人際表現。','工作與人際環境，會明顯影響我的情緒狀態。'],
[19,'WL','我比較害怕失去收入、機會或未來的發展空間。','我比較害怕失去重要的人或一段珍惜的關係。'],
[20,'BS','事情偶爾會有進展，但不久後又回到原來的狀態。','事情很少真正開始，總是延遲、等待或不了了之。'],
[21,'AR','我常因為行動太快，事後才發現有些細節沒有想清楚。','我常因為考慮太久，事後才發現機會已經錯過。'],
[22,'IE','我知道該怎麼做，卻常因為擔心後果而無法開始。','我知道該怎麼做，卻常因為現實條件不足而無法開始。'],
[23,'WL','我容易為工作表現、金錢或未來發展感到焦慮。','我容易為對方的態度、關係變化或人際互動感到焦慮。'],
[24,'BS','我目前最需要的是穩定現況，避免反覆失衡。','我目前最需要的是打破停滯，讓事情重新啟動。'],
[25,'AR','當別人遲遲沒有回應時，我會主動詢問或處理。','當別人遲遲沒有回應時，我會選擇先不打擾。'],
[26,'IE','很多問題即使換了環境，仍可能在我身上重複發生。','很多問題只要換一個環境或合作對象，就可能明顯改善。'],
[27,'WL','我希望別人肯定我的能力與成果。','我希望別人理解我的感受與真心。'],
[28,'BS','我的運勢感受比較像忽高忽低、難以掌握。','我的運勢感受比較像被堵住，長時間沒有流動。'],
[29,'AR','我相信事情需要靠自己的行動去推動。','我相信合適的時機到了，事情自然會有所變化。'],
[30,'IE','我目前最需要處理的是內在的穩定與信心。','我目前最需要處理的是外在的人際與環境問題。'],
[31,'WL','目前若只能改善一件事，我會優先選擇財業發展。','目前若只能改善一件事，我會優先選擇感情與人際關係。'],
[32,'BS','即使有好事發生，我也擔心無法持續。','比起無法持續，我更擔心好事根本不會開始。']
];

const singleQuestions = [
[33,'overall','我最近常覺得整體運勢偏低，不只一件事不順，而是生活中多個面向同時出現問題。'],
[34,'overall','即使沒有發生明顯的大事，我仍常感到精神疲憊、提不起勁，或對未來缺乏方向。'],
[35,'overall','我的狀況曾經短暫好轉，但很快又回到原來的不順狀態。'],
[36,'wealth','我目前的收入來源、賺錢機會或客源明顯不足，很難找到新的財源。'],
[37,'wealth','即使有收入，我仍常因突發支出、錯誤判斷或各種原因而留不住錢。'],
[38,'wealth','我在金錢、投資、收款或合作帳務方面，經常出現延遲、落空或反覆變動。'],
[39,'career','我在工作或事業上付出不少，但成果、升遷或收入沒有相對應的提升。'],
[40,'career','我目前對轉職、創業、擴編或未來事業方向感到猶豫，很難做出明確決定。'],
[41,'career','我明明具備能力，卻經常缺少被看見、被重用或獲得關鍵機會的可能。'],
[42,'people','我常遇到不守信用、不願配合，或容易造成麻煩的合作對象。'],
[43,'people','我在工作、家庭或朋友圈中，容易被誤解、議論、排擠或搶走成果。'],
[44,'people','我身邊並不是完全沒有人，但真正願意幫助、提攜或給我關鍵機會的人很少。'],
[45,'love','我目前缺乏穩定或合適的桃花，即使認識新對象，也很難真正發展。'],
[46,'love','我容易遇到態度不明、無法承諾、已有複雜關係，或不適合長期發展的對象。'],
[47,'love','我仍受到前任、舊情、曖昧關係或過去的感情經驗影響，難以真正重新開始。'],
[48,'home','家中成員近期容易爭吵、情緒不穩，或彼此之間的溝通明顯變差。'],
[49,'home','搬家、裝修、換工作地點或更換營業場所後，我的生活或工作狀態出現明顯變化。'],
[50,'home','家中、店面或工作空間長期雜亂、陰暗、沉悶，讓人不容易放鬆或久待。'],
[51,'inner','我常反覆糾結同一件事情，即使知道繼續想也沒有幫助，仍很難放下。'],
[52,'inner','我的焦慮、憤怒、恐懼或不安全感，已經明顯影響我的工作、睡眠或人際互動。'],
[53,'inner','我常因衝動、後悔、自責或過度猜測，而讓原本可以處理的事情變得更複雜。'],
[54,'ancestor','家中祭祀、祖先牌位、還願或宗教承諾，存在長期中斷、未完成或不知道如何處理的情況。'],
[55,'ancestor','家族中曾反覆出現相似的感情、財務、事業或家庭課題，讓我感到需要進一步了解。'],
[56,'ancestor','我近期常夢見已故親人、祖先或特定宗教意象，並因此感到在意、不安或想進一步確認。']
];

const checkQuestions = [
[57,'AR','遇到不確定的狀況時，我通常會先採取行動，再依結果進行調整。','遇到不確定的狀況時，我通常會繼續觀察，等掌握更多資訊後再決定。'],
[58,'IE','即使沒有人阻止我，我也可能因為擔心或缺乏信心而停下來。','即使我內心已經準備好，也常因為他人或現實條件而無法前進。'],
[59,'WL','最近最牽動我情緒的，大多與工作、收入或未來發展有關。','最近最牽動我情緒的，大多與感情、人際或家庭關係有關。'],
[60,'BS','最近的生活並非完全沒有好轉，只是好與壞經常反覆出現。','最近的生活比較像是停在原地，很少出現真正的突破。']
];

const safetyQuestions = [
[61,'expectation','我期待透過一次祈福或科儀，就能立即改變所有問題，而不需要調整自己的行動與選擇。'],
[62,'repeat','當事情沒有立刻好轉時，我容易想要同時進行多種祈福、科儀或尋找不同老師反覆處理。'],
[63,'control','我希望透過科儀，讓特定的人依照我的期待回頭、改變想法或做出決定。'],
[64,'professional','我目前遇到的問題可能涉及醫療、心理、法律、債務或人身安全，需要其他專業協助。'],
[65,'readiness','我願意將科儀視為輔助方式，並配合實際行動、溝通、財務規劃或生活調整。']
];

const questions = [
 ...pairQuestions.map(([id,dimension,first,second])=>({id,type:'pair',dimension,first,second})),
 ...singleQuestions.map(([id,domain,text])=>({id,type:'single',domain,text})),
 ...checkQuestions.map(([id,dimension,first,second])=>({id,type:'pair-check',dimension,first,second})),
 ...safetyQuestions.map(([id,key,text])=>({id,type:'single-safety',key,text}))
];

const axisMeta = {
 AR:{first:'A',second:'R',firstName:'主動推進',secondName:'觀察承接'},
 IE:{first:'I',second:'E',firstName:'內在牽制',secondName:'外在阻力'},
 WL:{first:'W',second:'L',firstName:'財業重心',secondName:'關係重心'},
 BS:{first:'B',second:'S',firstName:'波動失衡',secondName:'長期停滯'}
};
const domainMeta = {
 overall:{name:'整體運勢與元辰',directions:'補運、補元辰、安元辰、祭改、消災解厄或轉運祈福'},
 wealth:{name:'財運與財庫',directions:'開財路、招財、補財庫、守財、止漏財或化破財'},
 career:{name:'事業與工作',directions:'事業開路、補事業運、求職／升遷祈福、開智慧或補文昌'},
 people:{name:'貴人、人際與小人',directions:'補貴人、旺人緣、化小人、化口舌或人際和合'},
 love:{name:'桃花、感情與婚姻',directions:'招正緣、開桃花路、斬爛桃花、解結、斷舊迎新或去留請示'},
 home:{name:'家庭、家運與住宅',directions:'家庭和合、安宅、淨宅、旺家運或場所祈安'},
 inner:{name:'心性、情緒與解結',directions:'安心定志、解結、開智慧、增定力或斷舊迎新'},
 ancestor:{name:'祖先、祭祀與宗教責任',directions:'僅建議進一步請示確認；不可由問卷直接判定祖先或靈性問題'}
};
const letterNames={A:'主動推進',R:'觀察承接',I:'內在牽制',E:'外在阻力',W:'財業重心',L:'關係重心',B:'波動失衡',S:'長期停滯',X:'平衡／情境'};

let current=0;
let answers=JSON.parse(localStorage.getItem('luckAssessmentAnswers')||'{}');
let profile=JSON.parse(localStorage.getItem('luckAssessmentProfile')||'{}');

const $=id=>document.getElementById(id);
$('nameInput').value=profile.name||'';
$('lineInput').value=profile.line||'';
$('concernInput').value=profile.concern||'';

$('startBtn').onclick=()=>{
 profile={name:$('nameInput').value.trim(),line:$('lineInput').value.trim(),concern:$('concernInput').value.trim()};
 localStorage.setItem('luckAssessmentProfile',JSON.stringify(profile));
 $('landing').classList.add('hidden'); $('quiz').classList.remove('hidden'); renderQuestion();
};
$('saveBtn').onclick=()=>{save(); alert('進度已儲存在此瀏覽器。');};
$('prevBtn').onclick=()=>{if(current>0){current--;renderQuestion();}};
$('nextBtn').onclick=()=>{
 const q=questions[current];
 if(!answers[q.id]) return alert('請先選擇 1～5 分。');
 if(current<questions.length-1){current++;renderQuestion();} else {save();showResult();}
};
$('restartBtn').onclick=()=>{if(confirm('確定清除本次答案並重新開始？')){localStorage.removeItem('luckAssessmentAnswers');answers={};current=0;$('result').classList.add('hidden');$('landing').classList.remove('hidden');}};
$('printBtn').onclick=()=>window.print();
$('downloadJsonBtn').onclick=()=>download('運勢改善健檢結果.json',JSON.stringify(buildResult(),null,2),'application/json');
$('downloadCsvBtn').onclick=()=>download('運勢改善健檢答案.csv',toCsv(),'text/csv;charset=utf-8');

function save(){localStorage.setItem('luckAssessmentAnswers',JSON.stringify(answers));}
function renderQuestion(){
 const q=questions[current];
 $('questionCounter').textContent=`第 ${q.id} 題／65`;
 $('sectionLabel').textContent=q.id<=32?'運勢類型評估':q.id<=56?'八大面向評估':q.id<=60?'一致性檢核':'服務適用性檢核';
 $('progressBar').style.width=`${((current+1)/65)*100}%`;
 $('prevBtn').disabled=current===0;
 $('nextBtn').textContent=current===64?'完成並查看結果':'下一題';
 const selected=Number(answers[q.id]||0);
 if(q.type.startsWith('pair')){
  $('questionCard').innerHTML=`<div class="statement-pair"><div class="statement">${q.first}</div><div class="vs">或</div><div class="statement">${q.second}</div></div>${scaleHtml(selected)}<div class="scale-caption"><span>1＝靠近先出現敘述</span><span>5＝靠近後出現敘述</span></div>`;
 }else{
  $('questionCard').innerHTML=`<h3>${q.text}</h3>${scaleHtml(selected)}<div class="scale-caption"><span>1＝完全不符合</span><span>5＝非常符合</span></div>`;
 }
 document.querySelectorAll('input[name="score"]').forEach(el=>el.onchange=e=>{answers[q.id]=Number(e.target.value);save();});
 window.scrollTo({top:0,behavior:'smooth'});
}
function scaleHtml(selected){return `<div class="scale">${[1,2,3,4,5].map(v=>`<label><input type="radio" name="score" value="${v}" ${selected===v?'checked':''}><span>${v}</span></label>`).join('')}</div>`;}

function buildResult(){
 const axisScores={AR:0,IE:0,WL:0,BS:0};
 pairQuestions.forEach(([id,dim])=>axisScores[dim]+=Number(answers[id]));
 const axes={}; let code='';
 Object.entries(axisScores).forEach(([dim,score])=>{
  const m=axisMeta[dim]; const secondPct=Math.round(((score-8)/32)*100); const firstPct=100-secondPct;
  const letter=score<=22?m.first:score>=26?m.second:'X';
  axes[dim]={score,letter,firstPct,secondPct,strength:strength(score)}; code+=letter;
 });
 const domains={}; Object.keys(domainMeta).forEach(k=>domains[k]=0);
 singleQuestions.forEach(([id,domain])=>domains[domain]+=Number(answers[id]));
 const ranked=Object.entries(domains).sort((a,b)=>b[1]-a[1]);
 const consistency={}; checkQuestions.forEach(([id,dim])=>{consistency[dim]=consistencyStatus(axes[dim],Number(answers[id]));});
 const safety={}; safetyQuestions.forEach(([id,key])=>safety[key]=Number(answers[id]));
 return {generatedAt:new Date().toISOString(),profile,answers,code,typeName:code.split('').map(x=>letterNames[x]).join('・'),axes,domains,ranked,consistency,safety};
}
function strength(score){if(score<=15||score>=33)return'高度傾向';if(score<=19||score>=29)return'明顯傾向';if(score<=22||score>=26)return'輕度傾向';return'平衡／情境型';}
function consistencyStatus(axis,check){
 if(axis.letter==='X') return check===3?'一致：平衡':'需留意：主測驗平衡但檢核有偏向';
 const first=axis.letter===axisMetaFromLetter(axis.letter).first;
 if(check===3)return'輕度差異：可能依情境改變';
 const checkFirst=check<=2;
 return checkFirst===first?'一致性良好':'明顯差異：建議人工確認';
}
function axisMetaFromLetter(letter){return Object.values(axisMeta).find(m=>m.first===letter||m.second===letter);}
function domainLevel(score){return score<=6?'目前不明顯':score<=9?'輕度關注':score<=12?'建議進一步評估':'優先評估面向';}

function showResult(){
 const r=buildResult(); $('quiz').classList.add('hidden'); $('result').classList.remove('hidden');
 $('typeCode').textContent=r.code; $('typeName').textContent=r.typeName;
 const top=r.ranked.slice(0,3);
 $('summaryCards').innerHTML=`<div class="summary-card">主要類型<strong>${r.code}</strong></div><div class="summary-card">第一優先<strong>${domainMeta[top[0][0]].name}</strong></div><div class="summary-card">作答完成<strong>65／65</strong></div>`;
 $('axisResults').innerHTML=Object.entries(r.axes).map(([dim,a])=>{const m=axisMeta[dim];return `<div class="axis-row"><div><strong>${a.letter}｜${letterNames[a.letter]}</strong><br><small>${a.strength}・總分 ${a.score}</small></div><div class="meter"><div style="width:${a.secondPct}%"></div></div><div>${m.first} ${a.firstPct}%｜${m.second} ${a.secondPct}%</div></div>`}).join('');
 $('domainResults').innerHTML=r.ranked.map(([key,score])=>`<div class="domain-row"><div><strong>${domainMeta[key].name}</strong><br><small>${domainLevel(score)}</small></div><div class="meter"><div style="width:${(score/15)*100}%"></div></div><div>${score}／15</div></div>`).join('');
 $('recommendations').innerHTML=top.map(([key,score],i)=>`<div class="recommendation"><strong>第 ${i+1} 順位｜${domainMeta[key].name}（${score} 分）</strong><br>可進一步評估：${domainMeta[key].directions}。高分只代表近期主觀困擾較強，不代表一定需要進行科儀。</div>`).join('');
 const checkItems=[];
 Object.entries(r.consistency).forEach(([dim,text])=>checkItems.push(`<div class="check-item ${text.includes('明顯')?'warn':''}"><strong>${dim} 軸：</strong>${text}</div>`));
 if(r.safety.expectation>=4)checkItems.push('<div class="check-item warn">對科儀的期待偏高：建議先說明科儀不能取代個人行動與現實調整。</div>');
 if(r.safety.repeat>=4)checkItems.push('<div class="check-item warn">可能有重複處理傾向：應先盤點近期已做過的項目，避免短期重複。</div>');
 if(r.safety.control>=4)checkItems.push('<div class="check-item warn">涉及希望改變特定他人：服務應以釐清關係、自身調整與尊重他人意願為原則。</div>');
 if(r.safety.professional>=4)checkItems.push('<div class="check-item danger">可能涉及醫療、心理、法律、債務或人身安全：應優先尋求相關專業協助。</div>');
 if(r.safety.readiness>=4)checkItems.push('<div class="check-item">受測者願意配合實際行動，較適合進入後續完整評估。</div>');
 $('checks').innerHTML=checkItems.join('');
 window.scrollTo({top:0,behavior:'smooth'});
}
function download(filename,text,type){const blob=new Blob([text],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);}
function toCsv(){
 const r=buildResult(); const rows=[['欄位','內容'],['姓名',profile.name||''],['LINE',profile.line||''],['主要問題',profile.concern||''],['類型',r.code],['類型名稱',r.typeName]];
 Object.entries(r.axes).forEach(([k,v])=>rows.push([`${k}總分`,v.score],[`${k}結果`,v.letter],[`${k}強度`,v.strength]));
 r.ranked.forEach(([k,v])=>rows.push([domainMeta[k].name,v]));
 questions.forEach(q=>rows.push([`第${q.id}題`,answers[q.id]]));
 return '\uFEFF'+rows.map(row=>row.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')).join('\n');
}

if(Object.keys(answers).length===65){/* 保留進度，但不自動跳結果 */}
