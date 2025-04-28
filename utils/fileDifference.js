/**
 * 比较两个数组之间的差异
 * @param {第一个数组} arr1 
 * @param {第二个数组} arr2 
 * @param {参照物} key 
 * @param {需要进行比较的数据} comparison 
 * @returns 
 */
export const compareArrayObjects = (arr1, arr2, key = 'id', comparison = []) => {
  const map1 = new Map(arr1.map(item => [item[key], item]));
  const map2 = new Map(arr2.map(item => [item[key], item]));

  const differences = {
    added: [],
    removed: [],
    modified: []
  };

  // 检查新增的对象
  for (const [id, item] of map2) {
    if (!map1.has(id)) {
      differences.added.push(item);
    }
  }

  // 检查删除的对象
  for (const [id, item] of map1) {
    if (!map2.has(id) && item) {
      differences.removed.push(item);
    }
  }

  // 检查修改的对象
  for (const [id, item1] of map1) {
    const item2 = map2.get(id);
    if (item2 && !deepEqual(item1, item2, comparison)) {
      differences.modified.push({
        id,
        oldValue: item1,
        newValue: item2,
        changes: findObjectChanges(item1, item2, comparison)
      });
    }
  }

  return differences;
}

// 深度比较两个对象是否相等
function deepEqual(a, b, comparison = []) {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;

  // 用于比较的关键字(数组)
  if (Array.isArray(comparison) && comparison.length !== 0) {
    return comparison.every(key => deepEqual(a[key], b[key], comparison));
  }

  // 用于比较的关键字(字符)
  if (!Array.isArray(comparison) && comparison) {
    return a[comparison] === b[comparison]
  }

  const keysA = Object.keys(a),
    keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => deepEqual(a[key], b[key]));
}

// 查找对象属性差异
function findObjectChanges(obj1, obj2) {
  const changes = {};
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  for (const key of allKeys) {
    const val1 = obj1[key],
      val2 = obj2[key];
    if (!deepEqual(val1, val2)) {
      changes[key] = {
        oldValue: val1,
        newValue: val2
      };
    }
  }
  return changes;
}