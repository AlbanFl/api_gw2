import requests
import json
from os.path import exists
from datetime import datetime
from datetime import time
from datetime import timedelta
from dateutil.relativedelta import relativedelta, FR, SA
import pytz

def assignWinner(currentJson, apiJson):
    for k,v in currentJson.items():
        scoresDict = dict()
        try:
            scores = apiJson["skirmishes"][int(k)-1]["scores"]
            if scores["green"] > scores["blue"] and scores["green"] > scores["red"]:
                scoresDict[1] = "green"
                if scores["blue"] > scores["red"]:
                    scoresDict[2] = "blue"
                    scoresDict[3] = "red"
                else:
                    scoresDict[2] = "red"
                    scoresDict[3] = "blue"
            elif scores["blue"] > scores["green"] and scores["blue"] > scores["red"]:
                scoresDict[1] = "blue"
                if scores["green"] > scores["red"]:
                    scoresDict[2] = "green"
                    scoresDict[3] = "red"
                else:
                    scoresDict[2] = "red"
                    scoresDict[3] = "green"
            else:
                scoresDict[1] = "red"
                if scores["green"] > scores["blue"]:
                    scoresDict[2] = "green"
                    scoresDict[3] = "blue"
                else:
                    scoresDict[2] = "blue"
                    scoresDict[3] = "green"
        except (KeyError, IndexError) as e:
            scoresDict[1]=""
            scoresDict[2]=""
            scoresDict[3]=""
    
        currentJson[k]["skirmishScore"] = scoresDict


def getCurrentSkirmish(currentDateTime, weekDay):
    if weekDay == 5 and currentDateTime.hour >= 20 :
        if currentDateTime < currentDateTime.replace(hour = 21, minute = 45):
            return 0
        elif currentDateTime < currentDateTime.replace(hour = 23, minute = 45):
            return 1
        else:
            return 2

    skirmish = 2
    timeIterator = datetime.now(pytz.timezone('Europe/Paris')) + relativedelta(weekday=SA(-1)) #last friday
    timeIterator = timeIterator.replace(hour = 1, minute = 45, second=0) #the start of the first skirmish

    while timeIterator < currentDateTime:
        skirmish += 1
        timeIterator += timedelta(hours =2)

    return skirmish

def saveJson():

    
    jsonDict = dict()
    #The only two lines to change to launch the script with another server.
    #List of server ID can be found here : https://wiki.guildwars2.com/wiki/API:2/worlds 
    #2103 for Augury Rock
    jsonDict["serverName"] = "Augury Rock"
    jsonDict["idWorld"] = 2103

    now = datetime.now(pytz.timezone('Europe/Paris'))
    jsonDict["date"] = now.strftime("%d/%m/%Y")
    jsonDict["time"] = now.strftime("%H:%M:%S")

    year, week_num, weekDay = now.isocalendar()

    #we make the week change on friday at 19:45
    if (weekDay == 5 and now > now.replace(hour = 19, minute = 45) ) or weekDay > 5:
        week_num +=1

    URL = "https://api.guildwars2.com/v2/wvw/matches?world=" + str(jsonDict["idWorld"])

    resp = requests.get(URL)

    #Color information
    if resp.json()["worlds"]["red"] == jsonDict["idWorld"]:
        jsonDict["worldColor"]="red"
    elif resp.json()["worlds"]["blue"] == jsonDict["idWorld"]:
        jsonDict["worldColor"]="blue"
    else:
        jsonDict["worldColor"]= "green"

    #count the current skirmish
    skirmish = getCurrentSkirmish(now, weekDay)

    if exists("results/results" + str(year) + "_" + str(week_num) + ".json"):
        f = open("results/results" + str(year) + "_" + str(week_num) + ".json", "r")
        currentJson = json.load(f)
        


    #general kills and ratios infos
    kills = resp.json()["kills"][jsonDict["worldColor"]]
    jsonDict["nbKills"] = kills
    deaths = resp.json()["deaths"][jsonDict["worldColor"]]
    jsonDict["nbDeaths"] = deaths
    if deaths != 0:
        jsonDict["ratio"] = kills/deaths
    else:
        jsonDict["ratio"] = kills
        
    if skirmish == 0 or not(exists("results/results" + str(year) + "_" + str(week_num) + ".json")):
        jsonDict["skirmishKills"] = 0
        jsonDict["skirmishDeaths"] = 0
        jsonDict["skirmishRatio"] = 0
        if skirmish == 0:
            jsonDict["nbKills"] = 0
            jsonDict["nbDeaths"] = 0
            jsonDict["ratio"] = 0
    else:
        try:
            previousSkirmish = currentJson[str(skirmish - 1)]
            oldDeaths = previousSkirmish["nbDeaths"]
            oldKills = previousSkirmish["nbKills"]
            jsonDict["skirmishKills"] = kills - oldKills
            jsonDict["skirmishDeaths"] = deaths-oldDeaths
            if oldDeaths != deaths : #prevents division by 0
                jsonDict["skirmishRatio"] = (kills - oldKills) / (deaths-oldDeaths)
            else:
                jsonDict["skirmishRatio"] = (kills - oldKills)
        except (KeyError, IndexError) as e:
            jsonDict["skirmishKills"] = 0
            jsonDict["skirmishDeaths"] = 0
            jsonDict["skirmishRatio"] = 0
        

    #Loops of the different maps infos
    for i in range (0,4):
        mapDict = dict()
        mapName=resp.json()['maps'][i]['type']
        kills = resp.json()['maps'][i]['kills'][jsonDict["worldColor"]]
        mapDict["nbKills"] = kills
        deaths = resp.json()['maps'][i]['deaths'][jsonDict["worldColor"]]
        mapDict["nbDeaths"] = deaths
        mapDict["ratio"] = round(mapDict["nbKills"]/mapDict["nbDeaths"], 3)
        if skirmish == 0 or not(exists("results/results" + str(year) + "_" + str(week_num) + ".json")):
            mapDict["skirmishKills"] = 0
            mapDict["skirmishDeaths"] = 0
            mapDict["skirmishRatio"] = 0
            if skirmish == 0:
                mapDict["nbKills"] = 0
                mapDict["nbDeaths"] = 0
                mapDict["ratio"] = 0
        else :
            try:
                previousSkirmish = currentJson[str(skirmish - 1)]
                oldDeaths = previousSkirmish[mapName]["nbDeaths"]
                oldKills = previousSkirmish[mapName]["nbKills"]
                mapDict["skirmishKills"] = kills - oldKills
                mapDict["skirmishDeaths"] = deaths-oldDeaths
                if oldDeaths != deaths : #prevents division by 0
                    mapDict["skirmishRatio"] = (kills - oldKills) / (deaths-oldDeaths)
                else:
                    mapDict["skirmishRatio"] = (kills - oldKills)
            except (KeyError, IndexError) as e:
                mapDict["skirmishKills"] = 0
                mapDict["skirmishDeaths"] = 0
                mapDict["skirmishRatio"] = 0

        jsonDict[mapName] = mapDict
    
    #first skirmish we write in an empty file
    if not(exists("results/results" + str(year) + "_" + str(week_num) + ".json")):
        finalDict = dict()
        finalDict[skirmish] = jsonDict
        assignWinner(finalDict, resp.json())
        f = open("results/results" + str(year) + "_" + str(week_num) + ".json","w")
        f.write(json.dumps(finalDict, indent = 2))
        f.close()


    #other skirmishes we append 
    else :
        currentJson[str(skirmish)] = jsonDict
        assignWinner(currentJson, resp.json())
        #pretty ugly
        f = open ("results/results" + str(year) + "_" + str(week_num) + ".json", "w")
        f.write(json.dumps(currentJson, indent = 2))
        f.close()



if __name__ == '__main__':
    saveJson()
