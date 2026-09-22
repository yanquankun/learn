/**
 * 49. 字母异位词分组
 *
 * 难度：中等
 * 题目链接：https://leetcode.cn/problems/group-anagrams/
 *
 * 给你一个字符串数组 strs，将其中互为字母异位词的字符串放在同一组，
 * 返回分组后的二维数组。
 *
 * 字母异位词：
 * 如果两个字符串包含的字母及每个字母出现的次数完全相同，
 * 仅排列顺序可能不同，则它们互为字母异位词。
 * 例如："eat" 和 "tea" 互为字母异位词。
 *
 * 规则：
 * - 每个字符串都需要放入对应的分组。
 * - 重复出现的字符串需要保留，不能去重。
 * - 分组之间、同一分组内的字符串顺序均不限。
 *
 * 示例 1：
 * 输入：strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
 * 输出：[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]
 *
 * 示例 2：
 * 输入：strs = [""]
 * 输出：[[""]]
 *
 * 示例 3：
 * 输入：strs = ["a"]
 * 输出：[["a"]]
 *
 * 数据范围：
 * - 1 <= strs.length <= 10^4
 * - 0 <= strs[i].length <= 100
 * - strs[i] 仅包含小写英文字母，也可以是空字符串。
 */

/**
 * 将互为字母异位词的字符串分到同一组。
 *
 * @param strs - 待分组的字符串数组。
 * @returns 分组后的二维数组，组间及组内顺序不限。
 *
 * @example
 * groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]);
 * // [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
 */
function groupAnagrams(strs: string[]): string[][] {
  if (strs.length < 2) return [strs];

  // 使用 Map 来存储分组结果，键为排序后的字符串，值为对应的字母异位词数组
  const map = new Map<string, string[]>();

  for (let i = 0; i < strs.length; i++) {
    // 结果需要的是原始字符串
    const str = strs[i];
    const key = str.split("").sort().join("");

    if (map.has(key)) {
      map.get(key)!.push(str);
    } else {
      map.set(key, [str]);
    }
  }

  return Array.from(map.values());
}

//====== 测试区域开始 ======
console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"])); // [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
console.log(groupAnagrams([""])); // [[""]]
console.log(groupAnagrams(["a"])); // [["a"]]
console.log(groupAnagrams(["", ""])); // [["", ""]]
console.log(groupAnagrams(["ab", "ba", "ab"])); // [["ab", "ba", "ab"]]
console.log(groupAnagrams(["a", "b", "c"])); // [["a"], ["b"], ["c"]]
console.log(groupAnagrams(["aab", "aba", "abb", "bba"])); // [["aab", "aba"], ["abb", "bba"]]
console.log(groupAnagrams(["ab", "aabb", "bbaa", "ba"])); // [["ab", "ba"], ["aabb", "bbaa"]]
//====== 测试区域结束 ======
