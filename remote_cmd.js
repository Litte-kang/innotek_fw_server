/**
 * make a cmd by paramters.
 *
 *@param 	{String}  midwareID.
 *@param 	{Number}  targetID.
 *@param 	{Array }  dryBulbCurveValue.
 *@param 	{Array }  wetBulbCurveValue.
 *@param 	{Array }  timeCurveValue.
 *@return	{Json  }  json.
 */
module.exports.makeConfigCurveCmd = function makeConfigCurveCmd(midwareID, targetID, dryBulbCurveValue, wetBulbCurveValue, timeCurveValue)
{
	var json = 
	{
		type:12,
		address:midwareID,
		data:[]
	};
	var tmp = 0;
	var i = 0

	json.data.push(((targetID >> 8) & 0x00ff));
	json.data.push((targetID & 0x00ff));

	for (i = 0; i < 10; ++i)
	{
		json.data.push(dryBulbCurveValue[i]);
	}

	for (i = 0; i < 10; ++i)
	{
		tmp = wetBulbCurveValue[i] * 10;
		json.data.push(((tmp >> 8) & 0x00ff));
		json.data.push((tmp & 0x00ff));
	}

	for (i = 0; i < 19; ++i)
	{
		json.data.push(timeCurveValue[i]);
	}
	
	return json;
}

/**
 * make a cmd by paramters.
 *
 *@param 	{String}  midwareID.
 *@param 	{Number}  targetID.
 *@param 	{Number}  size.
 *@return	{Json  }  json.
 */
module.exports.makeConfigTobaSizeCmd = function makeConfigTobaSizeCmd(midwareID, targetID, size)
{
	var json = 
	{
		type:13,
		address:midwareID,
		data:[]
	};

	json.data[0] = ((targetID >> 8) & 0x00ff);
	json.data[1] = (targetID & 0x00ff);

	json.data[2] = ((size >> 8) & 0x00ff);
	json.data[3] = (size & 0x00ff);

	return json;
}

/**
 * make a cmd by paramters.
 *
 *@param 	{String}  midwareID.
 *@param 	{Number}  targetID.
 *@return	{Json  }  json.
 */
module.exports.makeSearchStatusCmd = function makeSearchStatusCmd(midwareID, targetID)
{
	var isBelow = 0;
	var json = 
	{
		type:8,
		address:midwareID,
		data:[]
	};

	json.data[0] = ((targetID >> 8) & 0x00ff);
	json.data[1] = (targetID & 0x00ff);

	json.data[2] = isBelow;

	return json;
}

/**
 * make a cmd by paramters.
 *
 *@param 	{String}  midwareID.
 *@param 	{Number}  targetID.
 *@param 	{Number}  fwSize.
 *@param 	{String}  fwVersion.
 *@param 	{Number}  fwType.
 *@return	{Json  }  json.
 */
module.exports.makeFwUpdateCmd = function makeFwUpdateCmd(midwareID, targetID, fwSize, fwVersion, fwType)
{
	var json = 
	{
		type:4,
		address:midwareID,
		data:[]
	};
	
	json.data[0] = ((targetID >> 8) & 0x00ff);
	json.data[1] = (targetID & 0x00ff);
	
	json.data[2] = (fwSize >> 24) & 0x00ff;
	json.data[3] = (fwSize >> 16) & 0x00ff;
	json.data[4] = (fwSize >> 8)  & 0x00ff;
	json.data[5] = fwSize & 0x00ff;
	
	json.data[6] = (fwVersion >> 8) & 0x00ff;
	json.data[7] = (fwVersion & 0x00ff);
	
	json.data[8] = fwType;

	return json;
}

/**
 * make a cmd by paramters.
 *
 *@param 	{String}  midwareID.
 *@param 	{Number}  targetID.
 *@param 	{Number}  val.
 *@return	{Json  }  json.
 */
module.exports.makeConfigCurvePhaseCmd = function makeConfigCurvePhaseCmd(midwareID, targetID, val)
{
	var json = 
	{
		type:16,
		address:midwareID,
		data:[]
	};

	json.data[0] = ((targetID >> 8) & 0x00ff);
	json.data[1] = (targetID & 0x00ff);

	json.data[2] = parseInt(val);
	json.data[3] = 0;

	return json;
}


/*
//example
var g_dryBulbCurveValue = new Array(11,22,33,44,55,66,77,88,99,0);
var g_wetBulbCurveValue = new Array(31.5,32.5,32.5,32.5,32.5,32.5,32.5,32.5,32.5,32.5);
var g_timeCurveValue = new Array(32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,3);
var json_curve = g_MakeRemoteCmd.MakeConfigCurveCmd("0000000002", "00002", g_dryBulbCurveValue, g_wetBulbCurveValue, g_timeCurveValue);
var json_tobacco_size = g_MakeRemoteCmd.MakeConfigTobaSizeCmd("0000000002", "00002", 123);
var json_fw_update = g_MakeRemoteCmd.MakeFwUpdateCmd("0000000002", "00002", 95644, "002", 0);
var json_search_status = g_MakeRemoteCmd.MakeSearchStatusCmd("0000000002", "00007", 1);
*/



