const $ = id => document.getElementById(id);
let products = [];
let nextId = 1;
const sample = [
  {name:"Wireless Headphones",cost:1800,value:90},
  {name:"Mechanical Keyboard",cost:2200,value:95},
  {name:"Laptop Stand",cost:900,value:65},
  {name:"USB-C Hub",cost:1200,value:80},
  {name:"Desk Lamp",cost:650,value:45},
  {name:"External SSD",cost:2500,value:100},
  {name:"Mouse Pad",cost:250,value:20},
  {name:"Webcam",cost:1500,value:75}
];
const icons=["◈","⌘","▱","⌁","☼","▣","◇","◎"];
const money=n=>"₹"+Number(n).toLocaleString("en-IN");
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderProducts(){
  $("productCount").textContent=`${products.length} PRODUCTS`;
  $("catalogue").innerHTML=products.length?products.map((p,i)=>`
    <div class="product-row"><span class="product-icon">${icons[i%icons.length]}</span>
    <div class="product-info"><strong>${escapeHTML(p.name)}</strong><small>${money(p.cost)} COST · VALUE ${p.value}</small></div>
    <button class="remove" data-id="${p.id}" aria-label="Remove ${escapeHTML(p.name)}">×</button></div>`).join(""):`<p class="empty-selection">No products yet. Add products above or load the sample catalogue.</p>`;
  document.querySelectorAll(".remove").forEach(btn=>btn.addEventListener("click",()=>{products=products.filter(p=>p.id!==Number(btn.dataset.id));renderProducts();$("results").classList.add("hidden");}));
}
function addProduct(name,cost,value){
  if(!name.trim()||!Number.isFinite(cost)||cost<=0||!Number.isFinite(value)||value<=0){$("status").textContent="Enter a product name, positive cost and positive value.";return false;}
  products.push({id:nextId++,name:name.trim(),cost,value});renderProducts();$("status").textContent="Product added. You can add more or optimize the basket.";return true;
}
function loadSample(){
  products=[];nextId=1;
  sample.forEach(p=>products.push({...p,id:nextId++}));
  renderProducts();$("results").classList.add("hidden");$("status").textContent="Sample products loaded. Set your budget and optimize.";
}
function branchAndBound(items,budget){
  // Fractional-knapsack upper bound. Actual choices remain 0/1.
  const sorted=items.slice().sort((a,b)=>(b.value/b.cost)-(a.value/a.cost)||a.id-b.id);
  const n=sorted.length, trace=[];let nodes=0,pruned=0,bestValue=0,bestCost=0,bestChosen=[];
  function bound(index,cost,value){
    if(cost>budget)return -Infinity;
    let total=value,remaining=budget-cost;
    for(let i=index;i<n&&remaining>0;i++){
      const p=sorted[i];
      if(p.cost<=remaining){remaining-=p.cost;total+=p.value;}
      else{total+=(p.value/p.cost)*remaining;break;}
    }
    return total;
  }
  function search(index,cost,value,chosen){
    nodes++;
    const upper=bound(index,cost,value);
    if(cost>budget){
      pruned++;trace.push({type:"prune",index,cost,value,upper:0,reason:"Budget exceeded"});return;
    }
    if(upper<=bestValue && index<n){
      pruned++;trace.push({type:"prune",index,cost,value,upper,reason:"Upper bound cannot beat current best"});return;
    }
    trace.push({type:"visit",index,cost,value,upper,reason:index===n?"Complete solution":"Explore choices"});
    if(value>bestValue){bestValue=value;bestCost=cost;bestChosen=chosen.slice();}
    if(index===n)return;
    const p=sorted[index];
    // Include branch first, then exclude branch.
    search(index+1,cost+p.cost,value+p.value,[...chosen,p]);
    search(index+1,cost,value,chosen);
  }
  search(0,0,0,[]);
  return {bestValue,bestCost,bestChosen,trace,nodes,pruned,sorted};
}
function renderResults(result,budget){
  $("bestValue").textContent=result.bestValue.toLocaleString("en-IN");
  $("totalCost").textContent=money(result.bestCost);
  $("remaining").textContent=money(budget-result.bestCost)+" remaining";
  $("budgetUsed").textContent=(result.bestCost/budget*100).toFixed(1)+"%";
  $("nodesVisited").textContent=result.nodes;
  $("nodesPruned").textContent=`${result.pruned} branches pruned`;
  $("selectedItems").innerHTML=result.bestChosen.length?result.bestChosen.map(p=>`<div class="selected-item"><span>${escapeHTML(p.name)}</span><span>${money(p.cost)} · +${p.value}</span></div>`).join(""):`<div class="empty-selection">No products fit within this budget.</div>`;
  const pct=Math.min(100,result.bestCost/budget*100);
  $("donut").style.background=`conic-gradient(var(--mint) ${pct}%,#26344a ${pct}% 100%)`;
  $("donutPercent").textContent=pct.toFixed(0)+"%";
  $("trace").innerHTML=result.trace.map((t,i)=>`
    <div class="trace-row ${t.type}"><span class="trace-id">#${String(i+1).padStart(2,"0")}</span>
    <span class="trace-desc">Level ${t.index} · Cost ${money(t.cost)} · Value ${t.value} · Bound ${Number.isFinite(t.upper)?t.upper.toFixed(1):"—"} <br><span class="trace-badge">${t.type==="prune"?"PRUNED":t.index===result.sorted.length?"SOLUTION":"EXPLORED"}</span> <span>${escapeHTML(t.reason)}</span></span>
    <span class="trace-bound">${t.type==="prune"?"✕ CUT":"↳ NODE"}</span></div>`).join("");
  $("results").classList.remove("hidden");
}
$("addBtn").addEventListener("click",()=>{
  const ok=addProduct($("productName").value,Number($("productCost").value),Number($("productValue").value));
  if(ok){$("productName").value="";$("productCost").value="";$("productValue").value="";$("productName").focus();}
});
$("productName").addEventListener("keydown",e=>{if(e.key==="Enter")$("productCost").focus();});
$("sampleBtn").addEventListener("click",loadSample);
$("clearBtn").addEventListener("click",()=>{products=[];renderProducts();$("results").classList.add("hidden");$("status").textContent="Catalogue cleared.";});
$("optimizeBtn").addEventListener("click",()=>{
  const budget=Number($("budget").value);
  if(!Number.isFinite(budget)||budget<=0){$("status").textContent="Enter a budget greater than zero.";return;}
  if(!products.length){$("status").textContent="Add at least one product first.";return;}
  const result=branchAndBound(products,budget);
  renderResults(result,budget);
  $("status").textContent=`Optimization complete: best value ${result.bestValue} within ${money(budget)}.`;
  $("results").scrollIntoView({behavior:"smooth",block:"start"});
});
loadSample();
