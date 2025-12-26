#!/usr/bin/env python3
"""
批量处理 md 文件，将连续多个空行替换为单个空行
保留换行，但减少空隙

用法: python fix_md_spacing.py <目录路径>
示例: python fix_md_spacing.py ./稳定性建设
"""

import os
import re
import sys

def fix_spacing(content):
    """将连续的多个空行替换为单个空行"""
    # 匹配连续两个或更多空行（可能包含空格或制表符）
    # 替换为单个空行
    fixed = re.sub(r'\n\s*\n(\s*\n)+', '\n\n', content)
    return fixed

def process_file(filepath):
    """处理单个文件"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        fixed_content = fix_spacing(content)
        
        if content != fixed_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            return True
        return False
    except Exception as e:
        print(f"处理文件失败 {filepath}: {e}")
        return False

def main(directory):
    """遍历目录处理所有 md 文件"""
    modified_count = 0
    skipped_count = 0
    processed_files = []
    
    for root, dirs, files in os.walk(directory):
        for filename in files:
            if filename.lower().endswith('.md'):
                # 跳过 readme.md
                if filename.lower() == 'readme.md':
                    skipped_count += 1
                    print(f"跳过: {os.path.join(root, filename)}")
                    continue
                
                filepath = os.path.join(root, filename)
                if process_file(filepath):
                    modified_count += 1
                    processed_files.append(filepath)
                    print(f"已修改: {filepath}")
    
    print(f"\n处理完成!")
    print(f"已修改文件数: {modified_count}")
    print(f"跳过的 readme.md 文件数: {skipped_count}")
    
    return modified_count

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python fix_md_spacing.py <目录路径>")
        sys.exit(1)
    
    directory = sys.argv[1]
    if not os.path.isdir(directory):
        print(f"错误: {directory} 不是有效的目录")
        sys.exit(1)
    
    main(directory)
