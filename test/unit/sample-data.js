exports.data = {
  qtr: [{
    qName: 'AccountGroupMaster',
    qNoOfRows: 27,
    qFields: [{
      qName: 'AccountGroup', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 27, qnRows: 27, qSubsetRatio: 0.13043478260869565, qnTotalDistinctValues: 23, qnPresentDistinctValues: 3, qKeyType: 'ANY_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'AccountGroupDesc', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 27, qnRows: 27, qSubsetRatio: 1, qnTotalDistinctValues: 3, qnPresentDistinctValues: 3, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'AccountMaster',
    qNoOfRows: 103,
    qFields: [{
      qName: 'AccountGroup', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 103, qnRows: 103, qSubsetRatio: 1, qnTotalDistinctValues: 23, qnPresentDistinctValues: 23, qKeyType: 'ANY_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Account', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 103, qnRows: 103, qSubsetRatio: 1, qnTotalDistinctValues: 103, qnPresentDistinctValues: 103, qKeyType: 'PERFECT_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'Budget',
    qNoOfRows: 216,
    qFields: [{
      qName: 'MonthlyRegionKey', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 216, qnRows: 216, qSubsetRatio: 0.8571428571428571, qnTotalDistinctValues: 252, qnPresentDistinctValues: 216, qKeyType: 'PRIMARY_KEY', qTags: ['$key', '$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'Budget Amount', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 216, qnRows: 216, qSubsetRatio: 1, qnTotalDistinctValues: 185, qnPresentDistinctValues: 185, qKeyType: 'NOT_KEY', qTags: ['$numeric', '$integer'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'InventoryBalances',
    qNoOfRows: 836,
    qFields: [{
      qName: 'Line Desc 1', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 836, qnRows: 836, qSubsetRatio: 1, qnTotalDistinctValues: 824, qnPresentDistinctValues: 824, qKeyType: 'ANY_KEY', qTags: ['$key', '$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'ClassTurns', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.9712918660287081, qnNonNulls: 812, qnRows: 836, qSubsetRatio: 1, qnTotalDistinctValues: 22, qnPresentDistinctValues: 22, qKeyType: 'NOT_KEY', qTags: ['$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'ThroughputQty', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.9856459330143541, qnNonNulls: 824, qnRows: 836, qSubsetRatio: 1, qnTotalDistinctValues: 457, qnPresentDistinctValues: 457, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }, {
      qName: 'CostPrice', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.9856459330143541, qnNonNulls: 824, qnRows: 836, qSubsetRatio: 1, qnTotalDistinctValues: 711, qnPresentDistinctValues: 711, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }, {
      qName: 'StockOH', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.9856459330143541, qnNonNulls: 824, qnRows: 836, qSubsetRatio: 1, qnTotalDistinctValues: 263, qnPresentDistinctValues: 263, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'ItemMaster',
    qNoOfRows: 826,
    qFields: [{
      qName: 'Product Type', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 826, qnRows: 826, qSubsetRatio: 1, qnTotalDistinctValues: 31, qnPresentDistinctValues: 31, qKeyType: 'ANY_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Short Name', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 826, qnRows: 826, qSubsetRatio: 1, qnTotalDistinctValues: 826, qnPresentDistinctValues: 826, qKeyType: 'PERFECT_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Product Group', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 826, qnRows: 826, qSubsetRatio: 1, qnTotalDistinctValues: 17, qnPresentDistinctValues: 17, qKeyType: 'ANY_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Product Sub Group', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 826, qnRows: 826, qSubsetRatio: 1, qnTotalDistinctValues: 70, qnPresentDistinctValues: 70, qKeyType: 'ANY_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Product Line', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 826, qnRows: 826, qSubsetRatio: 1, qnTotalDistinctValues: 2, qnPresentDistinctValues: 2, qKeyType: 'NOT_KEY', qTags: ['$numeric', '$integer'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'ProductSubGroupMaster',
    qNoOfRows: 70,
    qFields: [{
      qName: 'Product Sub Group', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 70, qnRows: 70, qSubsetRatio: 1, qnTotalDistinctValues: 70, qnPresentDistinctValues: 70, qKeyType: 'PERFECT_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Product Sub Group Desc', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 70, qnRows: 70, qSubsetRatio: 1, qnTotalDistinctValues: 70, qnPresentDistinctValues: 70, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'ProductTypeMaster',
    qNoOfRows: 31,
    qFields: [{
      qName: 'Product Type', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 31, qnRows: 31, qSubsetRatio: 1, qnTotalDistinctValues: 31, qnPresentDistinctValues: 31, qKeyType: 'PERFECT_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Product Type Desc', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 31, qnRows: 31, qSubsetRatio: 1, qnTotalDistinctValues: 31, qnPresentDistinctValues: 31, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'ProductGroupMaster',
    qNoOfRows: 17,
    qFields: [{
      qName: 'Product Group', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 17, qnRows: 17, qSubsetRatio: 1, qnTotalDistinctValues: 17, qnPresentDistinctValues: 17, qKeyType: 'PERFECT_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Product Group Desc', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 17, qnRows: 17, qSubsetRatio: 1, qnTotalDistinctValues: 17, qnPresentDistinctValues: 17, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'ItemBranchMaster',
    qNoOfRows: 906,
    qFields: [{
      qName: 'Short Name', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.9701986754966887, qnNonNulls: 879, qnRows: 906, qSubsetRatio: 1, qnTotalDistinctValues: 826, qnPresentDistinctValues: 826, qKeyType: 'ANY_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Item-Branch Key', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 906, qnRows: 906, qSubsetRatio: 1, qnTotalDistinctValues: 906, qnPresentDistinctValues: 906, qKeyType: 'PERFECT_KEY', qTags: ['$key', '$ascii', '$text'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'SalesRepMaster',
    qNoOfRows: 64,
    qFields: [{
      qName: 'Sales Rep', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 64, qnRows: 64, qSubsetRatio: 1, qnTotalDistinctValues: 64, qnPresentDistinctValues: 64, qKeyType: 'PERFECT_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Sales Rep Name', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 64, qnRows: 64, qSubsetRatio: 1, qnTotalDistinctValues: 63, qnPresentDistinctValues: 63, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'FactTable',
    qNoOfRows: 73417,
    qFields: [{
      qName: 'MonthlyRegionKey', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 73417, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 252, qnPresentDistinctValues: 252, qKeyType: 'ANY_KEY', qTags: ['$key', '$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'Address Number', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.7796968004685564, qnNonNulls: 57243, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 130, qnPresentDistinctValues: 130, qKeyType: 'ANY_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'YYYYMM', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 73417, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 36, qnPresentDistinctValues: 36, qKeyType: 'ANY_KEY', qTags: ['$key', '$numeric', '$integer', '$timestamp', '$date'], qDerivedFields: [],
    }, {
      qName: 'CustKey', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.7796968004685564, qnNonNulls: 57243, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 130, qnPresentDistinctValues: 130, qKeyType: 'ANY_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Line Desc 1', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.7796968004685564, qnNonNulls: 57243, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 824, qnPresentDistinctValues: 824, qKeyType: 'ANY_KEY', qTags: ['$key', '$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'Item-Branch Key', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.7796968004685564, qnNonNulls: 57243, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 906, qnPresentDistinctValues: 906, qKeyType: 'ANY_KEY', qTags: ['$key', '$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'Region', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.9825653459008131, qnNonNulls: 72137, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 6, qnPresentDistinctValues: 6, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'Invoice Number', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.7499216802647888, qnNonNulls: 55057, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 18013, qnPresentDistinctValues: 18013, qKeyType: 'NOT_KEY', qTags: ['$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Late Shipment', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.7796968004685564, qnNonNulls: 57243, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 2, qnPresentDistinctValues: 2, qKeyType: 'NOT_KEY', qTags: ['$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Open Order Amount', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.017638966451911684, qnNonNulls: 1295, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 781, qnPresentDistinctValues: 781, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }, {
      qName: 'Order Number', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.7796968004685564, qnNonNulls: 57243, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 14369, qnPresentDistinctValues: 14369, qKeyType: 'NOT_KEY', qTags: ['$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Order Status', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.7796968004685564, qnNonNulls: 57243, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 4, qnPresentDistinctValues: 4, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'OrderDate', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.7796968004685564, qnNonNulls: 57243, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 666, qnPresentDistinctValues: 666, qKeyType: 'NOT_KEY', qTags: ['$numeric', '$integer', '$timestamp', '$date'], qDerivedFields: [],
    }, {
      qName: 'OrderID', qOriginalFields: [], qPresent: true, qHasNull: true, qInformationDensity: 0.7796968004685564, qnNonNulls: 57243, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 57243, qnPresentDistinctValues: 57243, qKeyType: 'NOT_KEY', qTags: ['$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'OrderStat', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.7796968004685564, qnNonNulls: 57243, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 4, qnPresentDistinctValues: 4, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'Promised Delivery Date', qOriginalFields: [], qPresent: true, qHasNull: true, qInformationDensity: 0, qnNonNulls: 0, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 0, qnPresentDistinctValues: 0, qKeyType: 'NOT_KEY', qTags: [], qDerivedFields: [],
    }, {
      qName: 'Sales Amount', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.7484233896781399, qnNonNulls: 54947, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 14561, qnPresentDistinctValues: 14561, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }, {
      qName: 'Sales Cost Amount', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.7484233896781399, qnNonNulls: 54947, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 7846, qnPresentDistinctValues: 7846, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }, {
      qName: 'Sales Margin Amount', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.7484233896781399, qnNonNulls: 54947, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 15879, qnPresentDistinctValues: 15879, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }, {
      qName: 'Sales Price', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.748328043913535, qnNonNulls: 54940, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 7695, qnPresentDistinctValues: 7695, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }, {
      qName: 'Sales Quantity', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.7484233896781399, qnNonNulls: 54947, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 306, qnPresentDistinctValues: 306, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }, {
      qName: 'Ship To', qOriginalFields: [], qPresent: true, qHasNull: true, qHasDuplicates: true, qInformationDensity: 0.7764550444719888, qnNonNulls: 57005, qnRows: 73417, qSubsetRatio: 1, qnTotalDistinctValues: 429, qnPresentDistinctValues: 429, qKeyType: 'NOT_KEY', qTags: ['$numeric', '$integer'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'Expenses',
    qNoOfRows: 7447,
    qFields: [{
      qName: 'Account', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 7447, qnRows: 7447, qSubsetRatio: 0.39805825242718446, qnTotalDistinctValues: 103, qnPresentDistinctValues: 41, qKeyType: 'ANY_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'MonthlyRegionKey', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 7447, qnRows: 7447, qSubsetRatio: 0.8571428571428571, qnTotalDistinctValues: 252, qnPresentDistinctValues: 216, qKeyType: 'ANY_KEY', qTags: ['$key', '$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'ExpenseActual', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 7447, qnRows: 7447, qSubsetRatio: 1, qnTotalDistinctValues: 5013, qnPresentDistinctValues: 5013, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }, {
      qName: 'ExpenseBudget', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 7447, qnRows: 7447, qSubsetRatio: 1, qnTotalDistinctValues: 2816, qnPresentDistinctValues: 2816, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'HistoryFlag',
    qNoOfRows: 36,
    qFields: [{
      qName: 'YYYYMM', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 36, qnRows: 36, qSubsetRatio: 1, qnTotalDistinctValues: 36, qnPresentDistinctValues: 36, qKeyType: 'PERFECT_KEY', qTags: ['$key', '$numeric', '$integer', '$timestamp', '$date'], qDerivedFields: [],
    }, {
      qName: '_HistoryFlag', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 36, qnRows: 36, qSubsetRatio: 1, qnTotalDistinctValues: 2, qnPresentDistinctValues: 2, qKeyType: 'NOT_KEY', qTags: ['$hidden', '$numeric', '$integer'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'Accounts',
    qNoOfRows: 45,
    qFields: [{
      qName: 'Account', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 45, qnRows: 45, qSubsetRatio: 0.4368932038834951, qnTotalDistinctValues: 103, qnPresentDistinctValues: 45, qKeyType: 'PRIMARY_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'AccountDesc', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 45, qnRows: 45, qSubsetRatio: 1, qnTotalDistinctValues: 45, qnPresentDistinctValues: 45, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'CustomerAddressMaster',
    qNoOfRows: 130,
    qFields: [{
      qName: 'Address Number', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 130, qnRows: 130, qSubsetRatio: 1, qnTotalDistinctValues: 130, qnPresentDistinctValues: 130, qKeyType: 'PERFECT_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Customer Address 1', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 130, qnRows: 130, qSubsetRatio: 1, qnTotalDistinctValues: 120, qnPresentDistinctValues: 120, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'Zip Code', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 130, qnRows: 130, qSubsetRatio: 1, qnTotalDistinctValues: 116, qnPresentDistinctValues: 116, qKeyType: 'NOT_KEY', qTags: [], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'CustomerMap',
    qNoOfRows: 73,
    qFields: [{
      qName: 'CustKey', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 73, qnRows: 73, qSubsetRatio: 0.5615384615384615, qnTotalDistinctValues: 130, qnPresentDistinctValues: 73, qKeyType: 'PRIMARY_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'CustKeyAR', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 73, qnRows: 73, qSubsetRatio: 1, qnTotalDistinctValues: 73, qnPresentDistinctValues: 73, qKeyType: 'PERFECT_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'CustomerMaster',
    qNoOfRows: 130,
    qFields: [{
      qName: 'Sales Rep', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 130, qnRows: 130, qSubsetRatio: 0.59375, qnTotalDistinctValues: 64, qnPresentDistinctValues: 38, qKeyType: 'ANY_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Address Number', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 130, qnRows: 130, qSubsetRatio: 1, qnTotalDistinctValues: 130, qnPresentDistinctValues: 130, qKeyType: 'PERFECT_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Segment', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 130, qnRows: 130, qSubsetRatio: 1, qnTotalDistinctValues: 8, qnPresentDistinctValues: 8, qKeyType: 'ANY_KEY', qTags: ['$key', '$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'Business Family', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 130, qnRows: 130, qSubsetRatio: 1, qnTotalDistinctValues: 6, qnPresentDistinctValues: 6, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'Customer', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 130, qnRows: 130, qSubsetRatio: 1, qnTotalDistinctValues: 130, qnPresentDistinctValues: 130, qKeyType: 'NOT_KEY', qTags: ['$text'], qDerivedFields: [],
    }, {
      qName: 'Customer Number', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 130, qnRows: 130, qSubsetRatio: 1, qnTotalDistinctValues: 130, qnPresentDistinctValues: 130, qKeyType: 'NOT_KEY', qTags: ['$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Customer Type', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 130, qnRows: 130, qSubsetRatio: 1, qnTotalDistinctValues: 2, qnPresentDistinctValues: 2, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'Distribution Channel Mgr', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 130, qnRows: 130, qSubsetRatio: 1, qnTotalDistinctValues: 5, qnPresentDistinctValues: 5, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'Division', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 130, qnRows: 130, qSubsetRatio: 1, qnTotalDistinctValues: 2, qnPresentDistinctValues: 2, qKeyType: 'NOT_KEY', qTags: ['$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Phone', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 130, qnRows: 130, qSubsetRatio: 1, qnTotalDistinctValues: 1, qnPresentDistinctValues: 1, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'Region Code', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 130, qnRows: 130, qSubsetRatio: 1, qnTotalDistinctValues: 4, qnPresentDistinctValues: 4, qKeyType: 'NOT_KEY', qTags: ['$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Regional Sales Mgr', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 130, qnRows: 130, qSubsetRatio: 1, qnTotalDistinctValues: 15, qnPresentDistinctValues: 15, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'Zone Mgr', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 130, qnRows: 130, qSubsetRatio: 1, qnTotalDistinctValues: 6, qnPresentDistinctValues: 6, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'ChannelMaster',
    qNoOfRows: 8,
    qFields: [{
      qName: 'Segment', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 8, qnRows: 8, qSubsetRatio: 1, qnTotalDistinctValues: 8, qnPresentDistinctValues: 8, qKeyType: 'PERFECT_KEY', qTags: ['$key', '$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'SegmentDesc', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 8, qnRows: 8, qSubsetRatio: 1, qnTotalDistinctValues: 6, qnPresentDistinctValues: 6, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'SegmentGroup', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 8, qnRows: 8, qSubsetRatio: 1, qnTotalDistinctValues: 2, qnPresentDistinctValues: 2, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'Calendar',
    qNoOfRows: 36,
    qFields: [{
      qName: 'YYYYMM', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 36, qnRows: 36, qSubsetRatio: 1, qnTotalDistinctValues: 36, qnPresentDistinctValues: 36, qKeyType: 'PERFECT_KEY', qTags: ['$key', '$numeric', '$integer', '$timestamp', '$date'], qDerivedFields: [],
    }, {
      qName: 'Fiscal Quarter', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 36, qnRows: 36, qSubsetRatio: 1, qnTotalDistinctValues: 4, qnPresentDistinctValues: 4, qKeyType: 'NOT_KEY', qTags: ['$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'Fiscal Year', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 36, qnRows: 36, qSubsetRatio: 1, qnTotalDistinctValues: 3, qnPresentDistinctValues: 3, qKeyType: 'NOT_KEY', qTags: ['$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'FiscalMonth', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 36, qnRows: 36, qSubsetRatio: 1, qnTotalDistinctValues: 12, qnPresentDistinctValues: 12, qKeyType: 'NOT_KEY', qTags: ['$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'FiscalMonthNum', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 36, qnRows: 36, qSubsetRatio: 1, qnTotalDistinctValues: 12, qnPresentDistinctValues: 12, qKeyType: 'NOT_KEY', qTags: ['$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'FiscalRollQt', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 36, qnRows: 36, qSubsetRatio: 1, qnTotalDistinctValues: 12, qnPresentDistinctValues: 12, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'ARSummary',
    qNoOfRows: 73,
    qFields: [{
      qName: 'CustKeyAR', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 73, qnRows: 73, qSubsetRatio: 1, qnTotalDistinctValues: 73, qnPresentDistinctValues: 73, qKeyType: 'PERFECT_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'ARGross', qOriginalFields: [], qPresent: true, qInformationDensity: 1, qnNonNulls: 73, qnRows: 73, qSubsetRatio: 1, qnTotalDistinctValues: 73, qnPresentDistinctValues: 73, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }, {
      qName: 'AROpen', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 73, qnRows: 73, qSubsetRatio: 1, qnTotalDistinctValues: 60, qnPresentDistinctValues: 60, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }, {
      qName: 'ARCurrent', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 73, qnRows: 73, qSubsetRatio: 1, qnTotalDistinctValues: 45, qnPresentDistinctValues: 45, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }, {
      qName: 'AR1-30', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 73, qnRows: 73, qSubsetRatio: 1, qnTotalDistinctValues: 40, qnPresentDistinctValues: 40, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }, {
      qName: 'AR31-60', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 73, qnRows: 73, qSubsetRatio: 1, qnTotalDistinctValues: 21, qnPresentDistinctValues: 21, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }, {
      qName: 'AR60+', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 73, qnRows: 73, qSubsetRatio: 1, qnTotalDistinctValues: 29, qnPresentDistinctValues: 29, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }, {
      qName: 'ARCredit', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 73, qnRows: 73, qSubsetRatio: 1, qnTotalDistinctValues: 29, qnPresentDistinctValues: 29, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }, {
      qName: 'ARSalesPerDay', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 73, qnRows: 73, qSubsetRatio: 1, qnTotalDistinctValues: 69, qnPresentDistinctValues: 69, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }, {
      qName: 'ARAvgBal', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 73, qnRows: 73, qSubsetRatio: 1, qnTotalDistinctValues: 70, qnPresentDistinctValues: 70, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }, {
    qName: 'ARSummary-1',
    qNoOfRows: 292,
    qFields: [{
      qName: 'CustKeyAR', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 292, qnRows: 292, qSubsetRatio: 1, qnTotalDistinctValues: 73, qnPresentDistinctValues: 73, qKeyType: 'ANY_KEY', qTags: ['$key', '$numeric', '$integer'], qDerivedFields: [],
    }, {
      qName: 'ARAge', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 292, qnRows: 292, qSubsetRatio: 1, qnTotalDistinctValues: 4, qnPresentDistinctValues: 4, qKeyType: 'NOT_KEY', qTags: ['$ascii', '$text'], qDerivedFields: [],
    }, {
      qName: 'ARAgeBal', qOriginalFields: [], qPresent: true, qHasDuplicates: true, qInformationDensity: 1, qnNonNulls: 292, qnRows: 292, qSubsetRatio: 1, qnTotalDistinctValues: 132, qnPresentDistinctValues: 132, qKeyType: 'NOT_KEY', qTags: ['$numeric'], qDerivedFields: [],
    }],
    qPos: { qx: 0, qy: 0 },
  }],
  qk: [{ qKeyFields: ['AccountGroup'], qTables: ['AccountGroupMaster', 'AccountMaster'] }, { qKeyFields: ['Account'], qTables: ['AccountMaster', 'Expenses', 'Accounts'] }, { qKeyFields: ['MonthlyRegionKey'], qTables: ['Budget', 'FactTable', 'Expenses'] }, { qKeyFields: ['Line Desc 1'], qTables: ['InventoryBalances', 'FactTable'] }, { qKeyFields: ['Product Group'], qTables: ['ItemMaster', 'ProductGroupMaster'] }, { qKeyFields: ['Product Sub Group'], qTables: ['ItemMaster', 'ProductSubGroupMaster'] }, { qKeyFields: ['Product Type'], qTables: ['ItemMaster', 'ProductTypeMaster'] }, { qKeyFields: ['Short Name'], qTables: ['ItemMaster', 'ItemBranchMaster'] }, { qKeyFields: ['Item-Branch Key'], qTables: ['ItemBranchMaster', 'FactTable'] }, { qKeyFields: ['Sales Rep'], qTables: ['SalesRepMaster', 'CustomerMaster'] }, { qKeyFields: ['Address Number'], qTables: ['FactTable', 'CustomerAddressMaster', 'CustomerMaster'] }, { qKeyFields: ['CustKey'], qTables: ['FactTable', 'CustomerMap'] }, { qKeyFields: ['YYYYMM'], qTables: ['FactTable', 'HistoryFlag', 'Calendar'] }, { qKeyFields: ['CustKeyAR'], qTables: ['CustomerMap', 'ARSummary', 'ARSummary-1'] }, { qKeyFields: ['Segment'], qTables: ['CustomerMaster', 'ChannelMaster'] }],
};
