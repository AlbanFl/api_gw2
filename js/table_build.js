/*fs.readdir(".",function(err, list){
  list.forEach(function(file){
      console.log(file);
      stats = fs.statSync(file);
      console.log(stats.mtime);
      console.log(stats.ctime);
  })
})*/

async function loadDatas(b=-1) {

  //get the good week file
  const reponse_properties = await fetch("./results/properties.json");
  const datas_properties = await reponse_properties.json();

  var year = datas_properties["year"]
  var week = datas_properties["CurrentWeek"]

  const response = await fetch('./results/results' + year.toString() + "_" + week.toString() + '.json');
  const datas = await response.json();

  function mouseClick(e) {
    results.innerHTML="";
    let sk = e.target.skirmish;
    if (sk.toString() in datas) {
      global=document.createElement("div");
      global.innerHTML="<h2> Skirmish : " + e.target.skirmish + "</h2";
      globalInner = document.createElement("div");
      globalInner.innerHTML = "<ul> <li> <b>Global :</b> </li>  <li> Ratio : " + Math.round(datas[sk]["skirmishRatio"] * 100)/100 + " </li> <li> Kills : " 
      + datas[sk]["skirmishKills"] + " </li> <li> Deaths : " 
      + datas[sk]["skirmishDeaths"] + " </li> </ul";
      globalInner.classList.add("col-12", "d-flex", "justify-content-center");
      global.appendChild(globalInner);
      global.classList.add("row");
      results.appendChild(global);
      

      allMapresults = document.createElement("div");
      ebg = document.createElement("div");
      ebg.innerHTML = "<ul> <li><b> EBG : </b></li>  <li> Ratio : " + Math.round(datas[sk]["Center"]["skirmishRatio"] * 100)/100 + " </li> <li> Kills : " 
      + datas[sk]["Center"]["skirmishKills"] + " </li> <li> Deaths : " 
      + datas[sk]["Center"]["skirmishDeaths"] + " </li> </ul";
      ebg.classList.add("col-3");
      allMapresults.appendChild(ebg);

      greenH = document.createElement("div");
      greenH.innerHTML = "<ul> <li><b> Green Home : </b></li>  <li> Ratio : " + Math.round(datas[sk]["GreenHome"]["skirmishRatio"] * 100)/100 + " </li> <li> Kills : " 
      + datas[sk]["GreenHome"]["skirmishKills"] + " </li> <li> Deaths : " 
      + datas[sk]["GreenHome"]["skirmishDeaths"] + " </li> </ul";
      greenH.classList.add("col-3");
      allMapresults.appendChild(greenH);

      blueH = document.createElement("div");
      blueH.innerHTML = "<ul> <li><b> Blue Home : </b></li>  <li> Ratio : " + Math.round(datas[sk]["BlueHome"]["skirmishRatio"] * 100)/100 + " </li> <li> Kills : " 
      + datas[sk]["BlueHome"]["skirmishKills"] + " </li> <li> Deaths : " 
      + datas[sk]["BlueHome"]["skirmishDeaths"] + " </li> </ul";
      blueH.classList.add("col-3");
      allMapresults.appendChild(blueH);

      redH = document.createElement("div");
      redH.innerHTML = "<ul> <li><b> Red Home : </b></li>  <li> Ratio : " + Math.round(datas[sk]["RedHome"]["skirmishRatio"] * 100)/100 + " </li> <li> Kills : " 
      + datas[sk]["RedHome"]["skirmishKills"] + " </li> <li> Deaths : " 
      + datas[sk]["RedHome"]["skirmishDeaths"] + " </li> </ul";
      redH.classList.add("col-3");
      allMapresults.appendChild(redH);
      allMapresults.classList.add("row");
      results.appendChild(allMapresults);
    } else if (sk == -1) { //global infos, not skirmish infos
      var lastSkirmish = -1; 
      for (const [key, value] of Object.entries(datas)) {
        if(parseInt(key) > lastSkirmish) {
          lastSkirmish = parseInt(key);
        }
      }

      if(lastSkirmish != -1) {

        global=document.createElement("div");
        global.innerHTML="<h2> Matchup Infos </h2";
        globalInner = document.createElement("div");
        globalInner.innerHTML = "<ul> <li> <b>Global :</b> </li>  <li> Ratio : " + Math.round(datas[lastSkirmish]["ratio"] * 100)/100 + " </li> <li> Kills : " 
        + datas[lastSkirmish]["nbKills"] + " </li> <li> Deaths : " 
        + datas[lastSkirmish]["nbDeaths"] + " </li> </ul";
        globalInner.classList.add("col-12", "d-flex", "justify-content-center");
        global.appendChild(globalInner);
        global.classList.add("row");
        results.appendChild(global);
        

        allMapresults = document.createElement("div");
        ebg = document.createElement("div");
        ebg.innerHTML = "<ul> <li><b> EBG : </b></li>  <li> Ratio : " + Math.round(datas[lastSkirmish]["Center"]["ratio"] * 100)/100 + " </li> <li> Kills : " 
        + datas[lastSkirmish]["Center"]["nbKills"] + " </li> <li> Deaths : " 
        + datas[lastSkirmish]["Center"]["nbDeaths"] + " </li> </ul";
        ebg.classList.add("col-3");
        allMapresults.appendChild(ebg);

        greenH = document.createElement("div");
        greenH.innerHTML = "<ul> <li><b> Green Home : </b></li>  <li> Ratio : " + Math.round(datas[lastSkirmish]["GreenHome"]["ratio"] * 100)/100 + " </li> <li> Kills : " 
        + datas[lastSkirmish]["GreenHome"]["nbKills"] + " </li> <li> Deaths : " 
        + datas[lastSkirmish]["GreenHome"]["nbDeaths"] + " </li> </ul";
        greenH.classList.add("col-3");
        allMapresults.appendChild(greenH);

        blueH = document.createElement("div");
        blueH.innerHTML = "<ul> <li><b> Blue Home : </b></li>  <li> Ratio : " + Math.round(datas[lastSkirmish]["BlueHome"]["ratio"] * 100)/100 + " </li> <li> Kills : " 
        + datas[lastSkirmish]["BlueHome"]["nbKills"] + " </li> <li> Deaths : " 
        + datas[lastSkirmish]["BlueHome"]["nbDeaths"] + " </li> </ul";
        blueH.classList.add("col-3");
        allMapresults.appendChild(blueH);

        redH = document.createElement("div");
        redH.innerHTML = "<ul> <li><b> Red Home : </b></li>  <li> Ratio : " + Math.round(datas[lastSkirmish]["RedHome"]["ratio"] * 100)/100 + " </li> <li> Kills : " 
        + datas[lastSkirmish]["RedHome"]["nbKills"] + " </li> <li> Deaths : " 
        + datas[lastSkirmish]["RedHome"]["nbDeaths"] + " </li> </ul";
        redH.classList.add("col-3");
        allMapresults.appendChild(redH);
        allMapresults.classList.add("row");
        results.appendChild(allMapresults);
      }
    }
  }

  for(let i = 1 ; i <= 84 ; i++ ) {
    var color_premier ="none";
    var color_deuxieme ="none";
    if (i.toString() in datas) {
      if ("skirmishScore" in datas[i.toString()]) {
        for (const [key, value] of Object.entries(datas[i.toString()]["skirmishScore"])) {
          if (key == "1") {
            color_premier= value;
          }
          if (key == "2") {
            color_deuxieme= value;
          }
        }
      }
    }

    current = document.getElementById(i.toString());
    prems = document.createElement('td');
    prems.innerHTML="1";
    prems.classList.add("premier");
    if (color_premier != "") {
      prems.classList.add(color_premier);
    } else {
      prems.classList.add("none");
    }
    prems.skirmish=i.toString()
    current.appendChild(prems);
    //prems.addEventListener('click', mouseClick);

    deuz = document.createElement('td');
    deuz.innerHTML="2";
    deuz.classList.add("deuxieme");
    if (color_deuxieme != "") {
      deuz.classList.add(color_deuxieme);
    } else {
      deuz.classList.add("none");
    }
    deuz.skirmish=i.toString()
    current.appendChild(deuz);
    //prems.addEventListener('click', mouseClick);
  }

  for (let i = 1 ; i <= 84 ; i++) {
    current = document.getElementById(i.toString());
    current.skirmish=i.toString();
    current.addEventListener('click', mouseClick);
  }

  globalInfos.skirmish=-1;
  globalInfos.addEventListener('click', mouseClick);



}

for (let i = 0 ; i < 12 ; i++) {
    currentRow = document.getElementById("row" + i);
    for(let j  = 0 ; j < 9 ; j++) {
      if(j == 0) {
        currentRow.innerHTML = currentRow.innerHTML + "<th scope='row'>" + i*2  + "-" + ((i*2) + 2)  + " </td>"
      } else if ( (j==1 && i <= 9) || (j == 8 && i > 9) ) {
        currentRow.innerHTML = currentRow.innerHTML + "<td class = 'none'></td>"
      } else  
      {
        currentRow.innerHTML = currentRow.innerHTML + "<td id=" + (((i + 1) + ((j-1) * 12)) - 10)   + " class = 'skirmish'> </td>"
      }
        
    }
    
}

loadDatas()