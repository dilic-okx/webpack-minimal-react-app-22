function areInputsEqual(newInputs, lastInputs) {
	if (newInputs.length !== lastInputs.length) {
		return false;
	}
	for (var i = 0; i < newInputs.length; i++) {
		if (newInputs[i] !== lastInputs[i]) {
			return false;
		}
	}
	return true;
}

export default function memoizeOne(resultFn, isEqual) {
	if (isEqual === void 0) { isEqual = areInputsEqual; }
	var lastThis;
	var lastArgs = [];
	var lastResult;
	var calledOnce = false;
	function memoized() {
		var newArgs = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			newArgs[_i] = arguments[_i];
		}
		if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
			return lastResult;
		}
		lastResult = resultFn.apply(this, newArgs);
		calledOnce = true;
		lastThis = this;
		lastArgs = newArgs;
		return lastResult;
	}
	return memoized;
}
  