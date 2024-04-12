import subprocess
import os

# 定义 exe 文件路径
exe_path = os.path.join(os.path.dirname(__file__), 'AElf.Typescript.Generator-macos')
# 执行 exe 文件
try:
    subprocess.run([exe_path, "/Users/xibo/AElf/protoc", "--proto_path=/Users/xibo/AElf/protoc/protos","/Users/xibo/AElf/protoc/protos", "/Users/xibo/AElf/aelf-developer-tools/aelf.tools/AElf.Tools/build/native/include/aelf"], check=True)
    print("Exe 文件运行成功。")
except subprocess.CalledProcessError as e:
    print(f"Exe 文件运行失败。错误代码: {e.returncode}")
    print(f"错误输出: {e.output.decode('utf-8')}")
