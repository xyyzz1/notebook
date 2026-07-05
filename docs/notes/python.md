---
comments: true
statistics: false
---

# 🐍 Python 自学笔记

## 什么是 Python？

Python 是一种**解释型、面向对象**的高级编程语言，由 Guido van Rossum 于 1991 年首次发布。它以**简洁清晰的语法**和**强大的标准库**著称，广泛应用于 Web 开发、数据科学、人工智能、自动化脚本等领域。

!!! note "Python 之禅"
    ```python
    >>> import this
    Beautiful is better than ugly.
    Explicit is better than implicit.
    Simple is better than complex.
    Complex is better than complicated.
    Readability counts.
    ```

---

## 基础语法

### 1. 变量与数据类型

```python
# 无需声明类型，直接赋值
name = 'Alice'          # str
age = 25                # int
height = 1.68           # float
is_student = True       # bool
hobbies = ['reading', 'coding']  # list

# 类型检查
print(type(name))       # <class 'str'>
print(type(age))        # <class 'int'>

# 多变量赋值
x, y, z = 1, 2, 3
a = b = c = 0
```

### 2. 基本数据类型

```python
# 字符串
text = "Hello, World!"
len(text)               # 13
text.upper()            # "HELLO, WORLD!"
text.lower()            # "hello, world!"
text.split(', ')        # ['Hello', 'World!']
text.replace('World', 'Python')  # "Hello, Python!"

# f-string 格式化
name = 'Alice'
greeting = f'Hello, {name}!'  # "Hello, Alice!"

# 数值
x = 10
y = 3
print(x + y)   # 13
print(x - y)   # 7
print(x * y)   # 30
print(x / y)   # 3.333... (浮点除法)
print(x // y)  # 3 (整除)
print(x % y)   # 1 (取余)
print(x ** y)  # 1000 (幂)

# 布尔值
print(True and False)  # False
print(True or False)   # True
print(not True)        # False
```

!!! tip "Python 中的真值判断"
    以下值被视为 `False`：`False`、`None`、`0`、`0.0`、`''`、`[]`、`{}`、`set()`。其余都为 `True`。

### 3. 列表（List）

```python
fruits = ['apple', 'banana', 'orange']

# 索引与切片
fruits[0]        # 'apple'
fruits[-1]       # 'orange' (倒数第一个)
fruits[0:2]      # ['apple', 'banana'] (左闭右开)
fruits[::-1]     # ['orange', 'banana', 'apple'] (反转)

# 常用操作
fruits.append('grape')      # 末尾添加
fruits.insert(1, 'mango')   # 指定位置插入
fruits.remove('banana')     # 按值删除
fruits.pop()                # 末尾弹出
fruits.pop(0)               # 指定位置弹出
len(fruits)                 # 长度
'apple' in fruits           # True (成员检查)

# 列表推导式
squares = [x**2 for x in range(10)]           # [0, 1, 4, 9, ..., 81]
evens = [x for x in range(20) if x % 2 == 0]  # [0, 2, 4, ..., 18]
```

### 4. 元组（Tuple）

```python
# 不可变序列
point = (3, 4)
colors = ('red', 'green', 'blue')

x, y = point       # 元组解包
print(f'({x}, {y})')  # "(3, 4)"
```

### 5. 字典（Dict）

```python
person = {
    'name': 'Alice',
    'age': 25,
    'city': 'Shanghai',
}

# 访问
person['name']           # 'Alice'
person.get('email', 'N/A')  # 'N/A' (安全访问，不存在返回默认值)

# 修改与添加
person['age'] = 26
person['email'] = 'alice@example.com'

# 遍历
for key, value in person.items():
    print(f'{key}: {value}')

# 字典推导式
squares = {x: x**2 for x in range(5)}  # {0: 0, 1: 1, 2: 4, ...}
```

### 6. 集合（Set）

```python
# 无序不重复集合
nums = {1, 2, 3, 3, 2, 1}
print(nums)  # {1, 2, 3}

# 集合运算
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a | b)  # {1, 2, 3, 4, 5, 6} (并集)
print(a & b)  # {3, 4}               (交集)
print(a - b)  # {1, 2}               (差集)
print(a ^ b)  # {1, 2, 5, 6}         (对称差)
```

---

## 控制流

### 条件判断

```python
score = 85

if score >= 90:
    grade = 'A'
elif score >= 80:
    grade = 'B'
elif score >= 70:
    grade = 'C'
elif score >= 60:
    grade = 'D'
else:
    grade = 'F'

print(f'成绩等级: {grade}')
```

### 循环

```python
# for 循环
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# 遍历列表
fruits = ['apple', 'banana', 'orange']
for i, fruit in enumerate(fruits):
    print(f'{i}: {fruit}')

# while 循环
count = 0
while count < 5:
    print(count)
    count += 1

# break 和 continue
for n in range(10):
    if n == 3:
        continue  # 跳过本次
    if n == 7:
        break     # 终止循环
    print(n)
```

---

## 函数

### 函数定义

```python
def greet(name, greeting='Hello'):
    """返回问候语（这是文档字符串 docstring）"""
    return f'{greeting}, {name}!'

# 调用
print(greet('Alice'))                    # "Hello, Alice!"
print(greet('Bob', greeting='Hi'))       # "Hi, Bob!"
print(greet(greeting='Hey', name='Eve')) # "Hey, Eve!"
```

### 参数类型

```python
# 位置参数
def add(a, b): return a + b

# 默认参数
def power(x, n=2): return x ** n

# 可变参数 (*args)
def sum_all(*numbers):
    return sum(numbers)

sum_all(1, 2, 3, 4)  # 10

# 关键字参数 (**kwargs)
def create_user(**info):
    for key, value in info.items():
        print(f'{key}: {value}')

create_user(name='Alice', age=25, city='Shanghai')
```

### Lambda 表达式

```python
# 匿名函数
square = lambda x: x ** 2
add = lambda a, b: a + b

# 常用于排序
students = [{'name': 'Alice', 'score': 85}, {'name': 'Bob', 'score': 92}]
students.sort(key=lambda s: s['score'], reverse=True)
```

### 装饰器

```python
import time
from functools import wraps

def timer(func):
    """计时装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f'{func.__name__} 执行耗时: {end - start:.4f}s')
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return 'done'
```

---

## 面向对象

```python
class Animal:
    """动物基类"""

    # 类属性
    kingdom = 'Animalia'

    def __init__(self, name, age):
        # 实例属性
        self.name = name
        self.age = age

    def speak(self):
        return f'{self.name} makes a sound.'

    def __str__(self):
        return f'{self.name} ({self.age} years old)'

    def __repr__(self):
        return f'Animal(name={self.name!r}, age={self.age!r})'


class Dog(Animal):
    """狗类，继承自动物"""

    def __init__(self, name, age, breed):
        super().__init__(name, age)
        self.breed = breed

    # 方法重写
    def speak(self):
        return f'{self.name} barks! Woof!'

    # 新方法
    def fetch(self):
        return f'{self.name} is fetching the ball.'


dog = Dog('Rex', 3, 'German Shepherd')
print(dog.speak())  # "Rex barks! Woof!"
print(dog)          # "Rex (3 years old)"
```

!!! note "特殊方法（魔术方法）"
    | 方法 | 用途 |
    |------|------|
    | `__init__` | 构造函数 |
    | `__str__` | `print()` 时的字符串表示 |
    | `__repr__` | 调试用的字符串表示 |
    | `__len__` | `len()` 调用 |
    | `__getitem__` | 索引访问 `obj[key]` |
    | `__iter__` | 迭代支持 |
    | `__enter__` / `__exit__` | 上下文管理器 |

---

## 文件操作

```python
# 写入文件
with open('example.txt', 'w', encoding='utf-8') as f:
    f.write('Hello, World!\n')
    f.write('第二行内容\n')

# 读取文件
with open('example.txt', 'r', encoding='utf-8') as f:
    content = f.read()         # 读取全部
    # lines = f.readlines()    # 按行读取为列表
    # for line in f:           # 逐行迭代
    #     print(line.strip())

# JSON 处理
import json

data = {'name': 'Alice', 'age': 25}
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('data.json', 'r', encoding='utf-8') as f:
    loaded = json.load(f)
```

!!! tip "使用 with 语句"
    `with` 语句会自动管理文件资源，确保文件在使用后正确关闭，无需手动调用 `f.close()`。

---

## 异常处理

```python
try:
    num = int(input('请输入一个数字: '))
    result = 10 / num
except ValueError:
    print('输入不是有效的数字！')
except ZeroDivisionError:
    print('不能除以零！')
except Exception as e:
    print(f'发生未知错误: {e}')
else:
    print(f'结果是: {result}')  # 没有异常时执行
finally:
    print('清理工作...')          # 无论如何都执行
```

---

## 常用标准库

```python
# os — 操作系统接口
import os
os.path.exists('file.txt')
os.path.join('dir', 'subdir', 'file.txt')

# datetime — 日期时间
from datetime import datetime, timedelta
now = datetime.now()
yesterday = now - timedelta(days=1)
print(now.strftime('%Y-%m-%d %H:%M:%S'))

# random — 随机数
import random
random.randint(1, 100)     # 随机整数
random.choice(['a', 'b'])  # 随机选择
random.shuffle(items)      # 随机打乱

# collections — 容器数据类型
from collections import Counter, defaultdict, OrderedDict
text = 'hello world'
counts = Counter(text)  # Counter({'l': 3, 'o': 2, ...})

# itertools — 迭代器工具
from itertools import combinations, permutations, chain
for combo in combinations([1, 2, 3], 2):
    print(combo)  # (1, 2), (1, 3), (2, 3)
```

---

## 常用第三方库概览

| 领域 | 库 | 用途 |
|------|-----|------|
| Web 框架 | FastAPI / Flask / Django | 构建 Web 应用和 API |
| HTTP 请求 | requests / httpx | 发送 HTTP 请求 |
| 数据科学 | pandas / numpy | 数据分析与科学计算 |
| 机器学习 | scikit-learn / PyTorch | 机器学习模型 |
| 爬虫 | BeautifulSoup / Scrapy | 网页数据抓取 |
| 图像处理 | Pillow / OpenCV | 图像处理与识别 |
| 测试 | pytest / unittest | 单元测试框架 |
| 数据库 | SQLAlchemy / pymongo | ORM / 数据库驱动 |

---

## 实用技巧

!!! tip "Pythonic 写法"

    **列表推导式代替循环**：
    ```python
    # 不推荐
    result = []
    for x in range(10):
        if x % 2 == 0:
            result.append(x * 2)

    # 推荐
    result = [x * 2 for x in range(10) if x % 2 == 0]
    ```

    **使用 enumerate 代替 range(len())**：
    ```python
    # 不推荐
    for i in range(len(items)):
        print(i, items[i])

    # 推荐
    for i, item in enumerate(items):
        print(i, item)
    ```

    **使用 zip 同时遍历多个序列**：
    ```python
    names = ['Alice', 'Bob', 'Eve']
    scores = [85, 92, 78]
    for name, score in zip(names, scores):
        print(f'{name}: {score}')
    ```

    **使用虚拟环境**：
    ```bash
    python -m venv venv
    source venv/bin/activate  # Linux/Mac
    venv\Scripts\activate     # Windows
    ```

---

## 参考资源

- [Python 官方教程](https://docs.python.org/zh-cn/3/tutorial/)
- [Real Python](https://realpython.com/)
- [Python 编程：从入门到实践](https://www.ituring.com.cn/book/1861)
- [Awesome Python](https://github.com/vinta/awesome-python) — Python 资源大全
