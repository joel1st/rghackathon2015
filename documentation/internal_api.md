# Internal API Endpoints
## Account
### register

* email must be unique
* on success: redirect to login with email and password

| Parameter  | Type  | Values/Desc  |
|---|---|---|
| email | email | |
| password | string | may not be empty |

|Return | Type | Values/Desc |
| --- | --- | --- |
| success | boolean | |
| msg  | string | only on failure |

### login
| Parameter  | Type  | Values/Desc  |
|---|---|---|
| email | email | |
| password | string | |

| Return | Type | Values/Desc |
| --- | --- | --- |
| success | boolean | |
| msg  | string | only on failure |

### editAccount
* user needs to be logged in

| Parameter | Type | Value/Desc |
| --- | --- | --- |
| newName | string | new account name |

| Return | Type | Value/Desc |
| --- | --- | --- |
| success | boolean | |

## Teams
### createTeam

Creates a new team with the given values + the current user as the owner.

* user needs to be logged in
* members must be valid summoners

| Parameter | Type | Value/Desc |
| --- | --- | --- |
| name | string |  |
| tag | string |  |
| region | config.Region | |
| members | [Member] | must be valid summoners in that region |

| Return | Type | Values/Desc |
| --- | --- | --- |
| success | boolean | |
| msg | string | error msg |
| failingMembers | \[Number\] | pointer into members array (failed lookup), only present if relevant |

### EditTeam

Updates a team.
* user needs to be logged in
* user needs to be the owner of the team
* members must be valid summoners in the team region

| Parameter | Type | Value/Desc |
| --- | --- | --- |
| tag | string | |
| name | string | |
| members | [Member] | |

| Return | Type | Values/Desc |
| --- | --- | --- |
| success | boolean | |
| msg | string | error msg |
| failingMembers | \[Number\] | pointer into members array (failed lookup), only present if relevant |

### EditTeam

Updates a team.
* user needs to be logged in
* user needs to be the owner of the team
* members must be valid summoners in the team region

| Parameter | Type | Value/Desc |
| --- | --- | --- |
| tag | string | |
| name | string | |
| members | [Member] | |

| Return | Type | Values/Desc |
| --- | --- | --- |
| success | boolean | |
| msg | string | error msg |
| failingMembers | \[Number\] | pointer into members array (failed lookup), only present if relevant |

### GetTeamList
Returns a team list for the given user.

* username must be a valid registered user

| Parameter | Type | Value/Desc |
| --- | --- | --- |
| username | string | username |

| Return | Type | Value/Desc |
| --- | --- | --- |
| success | boolean | |
| teams | [Team] | list of teams for the specified user |

### GetTeam

Returns the team for the given team id.

| Parameter | Type | Value/Desc |
| --- | --- | --- |
| teamId | integer | |

| Return | Type | Value/Desc |
| --- | --- | --- |
| success | boolean | |
| team | Team | |

### GetTeamList
Returns a team list for the given user.

* username must be a valid registered user

| Parameter | Type | Value/Desc |
| --- | --- | --- |
| username | string | username |

| Return | Type | Value/Desc |
| --- | --- | --- |
| success | boolean | |
| teams | [Team] | list of teams for the specified user |

### GetTeam

Returns the team for the given team id.

| Parameter | Type | Value/Desc |
| --- | --- | --- |
| teamId | integer | |

| Return | Type | Value/Desc |
| --- | --- | --- |
| success | boolean | |
| team | Team | |

## Tournament
### Create Tournament

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
| filters | List\<Filter\> | |
| maxTeams | int | maximum number of teams |
| bracketType | enum | atm only single elimination |

| Return value | Type | Values/Desc |
|---|---|---|
| success | boolean | |
| tournamentId | integer | only returned if the request was successful, id from our db |
| msg | string | only returned if request was unsuccessful |

### getTournament
Returns the tournament for the given id. (If you know the id you can view it!)

TODO: may be change id to some random value?

| Parameter | Type | Value/Desc |
| --- | --- | --- |
| tournamentId | integer | |

| Result | Type | Value/Desc |
| --- | --- | --- |
| success | boolean | |
|  tournament | Tournament | |

### Tournament/Teams
#### AddTeams (multiple or single)
Adds the given teams to the tournament.

* tournament must be in the same region as the team
* tournament is not full
* user is owner of the tournament OR (signUp is true AND signUpDeadline is not yet over)

| Parameter | Type | Values/Desc |
| --- | --- | --- |
| teams | [Team] | Array of teams |
| tournamentId | integer | |

| Return | Type | Values/Desc |
| --- | --- | --- |
| success | boolean | |
| teamIds | map(array_index => boolean)] | map from array index of the team to its id |

#### RemoveTeams (multiple or single)

* user is owner
* signUpDeadline is not over && remover is owner of the team(s)

| Parameter | Type | Values/Desc |
| --- | --- | --- |
| teamIds | [Integer] | array of team ids |

| Return | Type | Values/Desc |
| --- | --- | --- |
| success | map(array_index => boolean) | true if a team was not a part of the tournament |

### Tournament/Filter
#### addFilters

* user is tournament owner
* tournament hasn't been started yet (no games played!)

| Parameter | Type | Desc/Value |
| --- | --- | --- |
| tournamentId | integer | |
| filterIds | [integer] | array of filter ids |

| Return | Type | Desc/Value |
| --- | --- | --- |
| success | map(array_index => boolean) | |

#### removeFilters

* user is tournament owner
* tournament hasn't been started yet

| Parameter | Type | Desc/Value |
| --- | --- | --- |
| filterIds | [integer] | array of filter ids |
| tournamentId | integer | |

| Return | Type | Desc/Value |
| --- | --- | --- |
| success | map(array_index => boolean) | |

#### editFilters

* user is tournament owner
* tournament hasn't been started yet

| Parameter | Type | Desc/Value |
| --- | --- | --- |
| filterIds | [integer] | array of filter ids |
| tournamentId | integer | |
| parameter | [parameter] | parameter at index i is parameter for filter at index i! |

| Return | Type | Desc/Value |
| --- | --- | --- |
| success | map(array_index => boolean) | |

## Tournament/Games
### generateGames
* user is tournament owner
* doesn't delete old games (updates schedule accordingly)

Generates the games (only possible if no games have been played yet)

| Parameter | Type | Desc/Value |
| --- | --- | --- |
| tournamentId | integer | |

| Return | Type | Desc/Value |
| --- | --- | --- |
| success | boolean | |
| games | Tree\<Game\> | the generated games, root is the final |

### getGameCode
Returns the game code for a given game.

* returns the gameCode OR requests a new one from riot if not present
* must be tournament owner (in which the game is played)

| Parameter | Type | Desc/Value |
| --- | --- | --- |
| gameId | integer  | |

| Return | Type | Desc/Value |
| --- | --- | --- |
| gameCode | String | game code from riot's api |

### checkGame (checs game if game ended and rechecks the filters)
Checks manually if a game has ended and if it has executes the necessary checks.

* must be team owner of one of the participating teams OR tournament owner
* game was not evaluated yet

| Parameter | Type | Desc/Value |
| --- | --- | --- |
| gameId | integer | internal game id |

| Return  | Type | Desc/Value |
| --- | --- | --- |
| gameEnded | boolean | |
| game | Game | only present if gameEnded == true |


## Filter
### getAvailableFilters

* no conditions

No parameters expected.

| Return | Type | Desc/Value |
| --- | --- | --- |
| filters | [Filter] | array of filters |


## Static Data
### champions

* no conditions

No parameters expected.

|Return | Type | Values/Desc |
| --- | --- | --- |
| champions | [Champion] | array of champions |

### items

* no conditions

No parameters expected.

|Return | Type | Values/Desc |
| --- | --- | --- |
| items | [Item] | array of items |

# Parameter Type Definitions

## Team
| Key | Type | Desc |
| --- | --- | --- |
| name | string | teamname |
| tag | string | |
| region | string | |
| members | List\<Summoner\> | |

## Summoner
| Key | Type | Desc |
| --- | --- | --- |
| name | string | summoner name |
| captain | boolean | if the summoner is captain of the team |

## Tournament

| Key | Type | Desc |
| --- | --- | --- |
| name | string | tournament name |
| owner | name | account name of the owner |
| bracketType | enum | SINGLE_ELIMINATION et al. |
| pickType | enum | |
| mapType | enum | |
| spectatorType | enum | |
| maxNumberOfTeams | int | |
| public | boolean | |
| teamSize | int | \[1-5\] |
| created | Date | creation date |
| signUp | boolean | |
| signUpDeadline | Date | |
| teams | List\<Team\> | participating teams |
| games | Tree\<Game\> | ordered list with bye games |
| filters | List\<Filter\> | list of filters of different types|

## Failed Filter
| Key | Type | Desc |
| --- | --- | --- |
| filter | Filter | the failed filter |
| reason | Reason | reasion depending on the filter |


## Reason
| Key | Type | Desc |
| --- | --- | --- |
| team | enum | RED, BLUE |
| summonerId | int | summoner id of offending summoner, present if it's a failure of a summoner |
| offenseType | string | description for the offense |

E. g. list of summoners who warded or Tuple<Summoner, Champion> for banned champion filter

# Return Type Definitions

## Tournament
| Key | Type | Desc |
| --- | --- | --- |
| owner | string | account name of the owner |
| region | Region | |
| teamSize | integer | [1,5] |
| maxTeams | integer | |
| name | string | |
| spectatorType | SpectatorType | |
| bracketType | BracketType | |
| mapType | MapType | |
| pickType | PickType | |
| visibility | boolean | |
| signUp | boolean | |
| signUpDeadline | Date | |
| filter | List<Filter> | |
| teams | List<Team> | |
| games | List<Game> | |

## Team
| Key | Type | Desc |
| --- | --- | --- |
| manager | string | manager name |
| name | string | |
| tag | string | |
| region | Region | |
| members | List<Summoner> | |

## Summoner
| Key | Type | Desc |
| --- | --- | --- |
| name | string | |
| captain | boolean | |

## Game
| Key | Type | Desc |
| --- | --- | --- |
| tournamentId | integer | tournamentId (maybe the random value discussed above) |
| gameCode | string | game code from riot's api |
| blueTeam | Team | |
| redTeam | Team | |
| winner | TeamSide | |
| disqualification | boolean | if any of the teams got disqualified |
| failedFilters | List<Reason> | list of dq reasons |

## Filter
| Key | Type | Desc |
| --- | --- | --- |
| type | FilterType | |
| name | string | |

## Champion
| Key | Type | Desc |
| --- | --- | --- |
| name | string | |
| id | integer | |
| title | string | |
| key | string | |
| image | string | |
| version | string | |
| updated_at | Date | |

## Item
| Key | Type | Desc |
| --- | --- | --- |
| name | string | |
| id | integer | |
| image | string | |
| version | string | |
| updated_at | Date | |

## Reason
| Key | Type | Desc |
| --- | --- | --- |
| filter | integer |  |
| team | TeamSide | |
| summonerId | integer | id in the players of a game |
| reason | Object | unspecified object (depending on filter) |

# Enums

## TeamSide
| Value | Desc |
| --- | --- |
| RED | |
| BLUE | |

## BracketType

| Value | Desc |
| --- | --- |
| SINGLE_ELIMINATION | |

## PickType
| Value | Desc |
| --- | --- |
| BLIND_PICK | |
| DRAFT_MODE | |
| ALL_RANDOM | |
| TOURNAMENT_DRAFT | |


## SpectatorType
| Value | Desc |
| --- | --- |
| ALL | |
| NONE | |
| LOBBYONLY | |

## MapType
| Value | Desc |
| --- | --- |
| SUMMONERS_RIFT | |
| CRYSTAL_SCAR | |
| HOWLING_ABYSS | |
