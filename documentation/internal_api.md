# Internal API Endpoints

## Register
Registers a given user if he was not present before.
| Parameter  | Type  | Values/Desc  | 
|---|---|---|
| email | email | |
| password | str | restrictios for strenght |

|Return | Type | Values/Desc |
| --- | --- | --- |
| success | boolean | |
| errorMsg  | string | |

## Login
| Parameter  | Type  | Values/Desc  | 
|---|---|---|
| email | email | |
| password | str | restrictios for strenght |

|Return | Type | Values/Desc |
| --- | --- | --- |
| success | boolean | |
| errorMsg  | string | |

## Create Tournament
Creates a tournament if
	* user is logged in

| Parameter  | Type  | Values/Desc  | 
|---|---|---|
| name  | String  | alphanumeric string  | 
| pickType | enum  | BLIND_PICK, DRAFT_MODE, ALL_RANDOM, TOURNAMENT_DRAFT  | 
| mapType | enum | SUMMONERS_RIFT, CRYSTAL_SCAR, HOWLING_ABYSS |
| spectatorType | enum | NONE, LOBBYONLY, ALL |
| teamSize | int | \[1-5\] |
| public | boolean | |
| signups | boolean | true if teams can register for the tournament |
| endOfSignUp | int | signup deadline |  
| region | enum | one of the valid regions |
| filters | List<Filter> | |
| maxTeams | int | maximum number of teams | 

| Return value | Type | Values/Desc |
|---|---|---|
| success | boolean | |
| tournamentId | integer | only returned if the request was successful |
| errorMsg | string | only returned if request was unsuccessful |

## Add Team
Adds a team to a given tournament if
	* owner of the tournament is adding a team
	* team captain is adding the team and the tournament is public & signups are available
	* additionaly adds the team as owned by the team captain/owner if nonexistant
	* (maybe) restriction if the tournament has already progressed/started
	* tournament is not full
	* is not after signup deadline

| Parameter | Type | Values/Desc
| --- | --- | --- |
| name | string | team name |
| tag | strign | tag with lenght between \[1-5\] (must be unique for a tournament) |
| tournamentId | integer | |
| region | enum | one of the valid regions |
| members | List<String> | list of valid summoner names |

| Return value | Type | Value/Desc |
| --- | --- | --- |
| success | boolean | |
| teamId | int | unique identifier over all regions |
| errorMsg | string | different error msgs if user was not found / team name not unique for a tournament |

## Get Teams for User
Returns the teams associated with the current user

No parameters expected.

| Return value | Type | Value/Desc |
| --- | ---| ---|
| teams | List<Team> | only the teams associated with the user|

## Generate Game Code
Returns the game code for a given game id if the current user is either a participating team member OR the owner of the tournament

| Parameter | Type | Value/Desc |
| --- | --- | --- |
| tournamentId | int |  |
| region | int | |
| gameId | int | |

## getTournament
Returns a Tournament DTO
**Conditions**
* current user is owner
* tournament is public
* current user is captain of a participating team

| Parameter | Type | Value/Desc |
| --- | --- | --- |
| tournamentId | int | |
| region | enum | |


**Tournament** or 
| Parameter | Type | Value/Desc |
| --- | --- | --- |
| errorMsg  | string | |


# Object Definitions

## Team
| Key | Type | Desc |
| --- | --- | --- |
| id | integer | |
| name | string | teamname |
| tag | string | |
| members | List<Summoner> | |

## Summoner
| Key | Type | Desc |
| --- | --- | --- |
| name | string | summoner name |
| region | string | valid region |
| summonerId | int |

## Game
| Key | Type | Desc |
| --- | --- | --- |
| red_team | int | team id |
| blue_team | int | team id |
| finisehd | boolean | |
| winner | enum | RED, BLUE, **only** present if finished == true |
| disqualification | boolean | **only** present if finished == true |

## Filter
| Key | Type | Desc |
| --- | --- | --- |
| type | enum | one of the allowed filter types (e. g. no warding) |
| parameters | Filter-Parameter | filter parameter object depending on the filter type |

Examples for parameters:
*  List<Champion> for banned champions filter.

## Champion
| Key | Type | Desc |
| --- | --- | --- |
| id | int | champion id from riot api |
| name | string | |
| champPic | tuple<Integer> | tuple containing x and y coordinates (one picture with all champs like google does for their icons) |

## Tournament
| Key | Type | Desc |
| --- | --- | --- |
| name | string | tournament name |
| pickType | enum | |
| mapType | enum | |
| spectatorType | enum | |
| maxNumberOfTeams | int | |
| public | boolean | |
| teamSize | int | \[1-5\] |
| public | boolean | if the tournament is public |
| teams | List<Team> | participating teams |
| games | List<Game> | ordered list with bye games |
| filters | List<Filter> | list of filters of different types|
