/**
 * webSql - Web Storage SQL - a query system to retrieve
 * hierarchical data from web storage or arrays
 * Created by jnegron on 2/3/2015.
 */

var Sql = function(statement, targetArrayObj){
    "use strict";
    var errors = {
        invalid : {
            missing_spaces : "Statement is not formatted correctly. Please include spaces in your webSql statements."
        },
        required : {
            missing_select : "The SELECT keyword is missing from your statement, please revise.",
            missing_from : "The FROM keyword is missing from your statement, please revise.",
            missing_where : "The WHERE keyword is missing from your statement, please revise."
        }
    };

    function getObjectByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    }

    /**
     * @return {boolean}
     */
    function Exists(target) {
        return (target != undefined) && (target != "undefined") && (target != null);
    }

    function isNull(target) {
        return !Exists(target);
    }

    function isNullOrEmpty(target) {
        if (!Exists(target)) return true;
        return target === "";
    }

    function isNotNull(target) {
        return Exists(target);
    }

    function isNotNullOrEmpty(target) {
        if (Exists(target)) return target !== "";
        return false;
    }

    function getNumOfSpaces(){
        var spaces = 0;
        for (var i = 0; i < statement.length; i++) {
            if (statement[i] === " ") spaces++;
        }
        return spaces;
    }

    var numOfSpaces = getNumOfSpaces();
    if(numOfSpaces < 5) throw new Error(errors.invalid.missing_spaces);
    if(statement.toLowerCase().indexOf("select") < 0) throw new Error(errors.required.missing_select);
    if(statement.toLowerCase().indexOf("from") < 0) throw new Error(errors.required.missing_from);
    if(statement.toLowerCase().indexOf("where") < 0) throw new Error(errors.required.missing_where);
    //select signatureAudit from policies where policyid = 123456
    var s = statement.split(" ");
    //var targetObject = s[1];
    var targetField = s[5];
    var targetValue = s[7];
    var targetArray = null;
    if(Exists(targetArrayObj)) targetArray = targetArrayObj;
    //if argument is null then try sessionStorage
    if(isNull(targetArray)) targetArray = sessionStorage.getItem(s[3]);
    //if not found in sessionStorage then look in localStorage
    if(isNull(targetArray)) targetArray = localStorage.getItem(s[3]);
    //if not found throw error
    if(isNull(targetArray)) throw new Error(s[3]+" not found in web storage or parameters!");
    targetArray = JSON.parse(targetArray);
    return getObjectByKey(targetArray, targetField, targetValue);
};
