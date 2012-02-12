var TILE_TEXTURE = {
	1: 'beach-shallow',
	2: 'shallow-deep',
	3: 'grass',
	4: 'grass-beach',
	5: 'beach-shallow',
	6: 'beach'
};

var BUILDINGS = {
	17: [1, 1, 
	     ['trees/as_tupelo1/idle_full/45', /*'trees/as_birch/idle_full/45',*/
		  'trees/as_maple1/idle_full/45', 'trees/as_tupelo/idle_full/45',
		  'trees/as_maple2/idle_full/45', 'trees/as_spruce/idle_full/45',
		  'trees/as_tupelo2/idle_full/45', 'trees/as_maple3/idle_full/45',
		  'trees/as_spruce1/idle_full/45']],
	23: [3, 3,
	     ['resources/as_clay/idle/45/1.png']],
	33: [2, 2,
	     ['fish']],
	34: [5, 5,
		 ['mountains/as_mountain5x5/idle/45']],
	 1: [3, 3,
	 	 ['sailors/warehouse/as_warehouse/idle/45']],
	 4: [6, 6,
	 	 ['sailors/mainsquare/as_mainsquare/idle/45']],
	 3: [2, 2,
	 	 ['pioneers/residential/as_hut/idle/45']],
	11: [2, 2,
		 ['sailors/fisherman/as_fisherman/idle/45']],
	 8: [2, 2, 
	 	 ['sailors/lumberjack/as_lumberjack/idle/45']],
	15: [1, 1,
		 ['sailors/streets/as_trail/abcd/45']],
	 5: [2, 2,
	 	 ['pioneers/church_wooden/as_church_wooden/idle/45']],
	 6: [1, 1,
	 	 ['sailors/signalfire/as_signalfire/idle/45']],
	 9: [2, 2,
	 	 ['sailors/hunter/as_hunter/idle/45']],
	 2: [1, 1,
	 	 ['sailors/storagetent/as_storagetent/idle/45']],
	24: [2, 4,
		 ['pioneers/brickyard/as_brickyard/idle/45']],
	20: [2, 2,
		 ['pioneers/farm/as_farm/idle/45']],
	18: [2, 2,
		 ['pioneers/agricultural/as_pasture/idle/45/0000.png']]
	/*
	RESIDENTIAL_CLASS = 3
	WEAVER_CLASS = 7
	SETTLER_RUIN_CLASS = 10
	BOATBUILDER_CLASS = 12
	PASTURE_CLASS = 18
	POTATO_FIELD_CLASS = 19
	VILLAGE_SCHOOL_CLASS = 21
	SUGARCANE_FIELD_CLASS = 22
	CLAY_PIT_CLASS = 25
	DISTILLERY_CLASS = 26
	IRON_MINE_CLASS = 28
	SMELTERY_CLASS = 29
	TOOLMAKER_CLASS = 30
	CHARCOAL_BURNER_CLASS = 31
	TAVERN_CLASS = 32
	SALT_PONDS_CLASS = 35
	TOBACCO_FIELD_CLASS = 36
	TOBACCONIST_CLASS = 37
	*/
};

var TILE_WIDTH = 64,
	TILE_HEIGHT = 32;
