---
abbrlink: '0'
title: jsp_final
---
# jsp_finaltest
## jsp执行过程
客户端向服务器发送请求。
服务器接收到请求，并根据请求的URL和其他参数选择对应的处理程序进行处理。
翻译阶段：
如果请求的处理程序是JSP文件，服务器会翻译JSP文件成为Servlet源代码。
编译阶段：
并编译成Java字节码文件。如果请求的处理程序是Servlet或者其他Java类文件，服务器则直接编译Java文件成为字节码文件。
执行阶段：
服务器根据请求创建一个HTTP响应对象，并将响应头信息写入到这个对象中。
如果请求的处理程序需要生成HTML内容，服务器会执行相应的Java代码来生成HTML内容，并将HTML内容写入到HTTP响应对象的正文中。
服务器将HTTP响应对象发送回给客户端。
客户端接收到HTTP响应，解析响应头和正文，并根据响应头中的Content-Type信息来解析正文内容。如果Content-Type是text/html，客户端会将HTML内容解析并显示在浏览器中。
## 三种指令
### page

```
<%@ page language="java" contentType="text/html import = "java.util.*"; charset=UTF-8"
    pageEncoding="UTF-8" isErrorPage="false" %>
```

### include
```
<%@include file = "***.jsp">
```

### taglib
```
<%@ taglib uri="/WEB-INF/mytaglib.tld" prefix="mytag" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Taglib Example</title>
</head>
<body>
    <h1>Taglib Example</h1>
    <p>The following is a custom tag:</p>
    <mytag:hello name="World" />
    <p>You can view the source code of this page to see how to use custom tags in JSP.</p>
</body>
</html>
```
我们使用了taglib指令导入了一个名为mytag的自定义标签库。在JSP页面的正文部分，我们使用了<mytag:hello>标签来调用自定义标签库中的hello标签，并传入了一个名为name的参数，值为World。在实际运行时，JSP容器会将<mytag:hello>标签转换为对应的Java代码，然后执行这段代码，最后将执行结果输出到浏览器中.
## jsp声明
![jsp声明](https://img1.imgtp.com/2023/06/18/ZKNbzIJc.png)
<%! ... %>
## jsp脚本
```
<%int a = 10;
int b = 5;
int result = a+b%>//脚本

```
## jsp表达式
```
<%
String name = "World";
out.print("Hello, " + name);
%>
```


## jsp注释
<!-- HTML -->

<%--  JSP --%>

脚本内: //   /*

## 内置对象，流转对象
流转:request response
作用域:pageContext,request,session,application
其他:out,config,exception,page

request对象的原型是javax.servlet.http.HttpServletRequest类
response对象的原型是javax.servlet.http.HttpServletResponse类
out对象的原型是javax.servlet.jsp.JspWriter类
session对象的原型是javax.servlet.http.HttpSession类
application对象的原型是javax.servlet.ServletContext类
config对象的原型是javax.servlet.ServletConfig类
pageContext对象的原型是javax.servlet.jsp.PageContext类
page对象的原型是生成的JSP页面类
exception对象的原型是java.lang.Throwable类或其子类
![内置对象.png](https://img1.imgtp.com/2023/06/18/a3NKa3DY.png)
## 请求转发重定向
### 请求 
#### 请求传递：
用户向服务器a请求，a将需求传递给b，b直接将结果返回给用户
#### 请求包含
用户向服务器a请求，a将需求传递给b，b将结果传递给a，a整合结果，返回给用户
### 重定向
用户向a服务器请求，a返回一个b服务器的地址给用户，用户访问b的服务器，b服务器返回一个信息给用户。
### 区别
![redirect](https://img1.imgtp.com/2023/06/18/Ay8DoZ1L.png)
## 访问控制
session 
code:
在这个例子中，如果用户名和密码正确，就将用户名保存在session中，并重定向到欢迎页面（例如welcome.jsp）；否则重定向回登录页面，并附加一个错误参数（例如?error=1）。
```
public class LoginServlet extends HttpServlet {
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        if ("admin".equals(username) && "123456".equals(password)) {
            HttpSession session = request.getSession();
            session.setAttribute("username", username);
            response.sendRedirect("welcome.jsp");
        } else {
            response.sendRedirect("login.jsp?error=1");
        }
    }
}
```
在受保护的资源（例如admin.jsp）中，先检查session中是否包含已登录用户的信息，如果没有则重定向到登录页面：
```
public class AdminServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("username") == null) {
            response.sendRedirect("login.jsp");
            return;
        }
        // 省略其他处理代码
    }
}
```
### cookie和session的区别
![cookie](https://img1.imgtp.com/2023/06/18/C8dUqihk.png)

## EL表达式
 以下是一些常用的EL表达式：
获取请求参数：${param.paramName}，其中paramName是请求参数的名称；
获取请求属性：${request.attributeName}，其中attributeName是请求属性的名称；
获取session属性：${session.attributeName}，其中attributeName是session属性的名称；
获取ServletContext属性：${application.attributeName}，其中attributeName是ServletContext属性的名称；
### EL内置对象
获取JSP页面作用域（page scope）属性：${pageScope.attributeName}，其中attributeName是页面作用域属性的名称；
获取JSP页面上下文（request scope）属性：${requestScope.attributeName}，其中attributeName是页面上下文属性的名称；
获取JSP页面会话（session scope）属性：${sessionScope.attributeName}，其中attributeName是页面会话属性的名称；
获取JSP页面应用程序（application scope）属性：${applicationScope.attributeName}，其中attributeName是页面应用程序属性的名称；
code:
```
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Hello, EL!</title>
</head>
<body>
    <h1>Hello, ${param.name}!</h1>
    <p>Your email address is: ${request.email}</p>
    <c:if test="${empty param.name}">
        <p>Please enter your name.</p>
    </c:if>
</body>
</html>
```
### jstl标签
#### 通用标签
set,out,remove
```
<c:set var="example"value = "${100+1}"scope = "session"/>
<c:out value = "${example}"/>
```
输出101   scope :填内置对象
```
<c:remove var = "example"scope="session"/>
```
删除example变量

#### 条件标签
if
```
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>JSTL If Example</title>
</head>
<body>
    <c:set var="score" value="80"/>
    <c:if test="${score >= 60}">
        <p>Congratulations, you passed the exam!</p>
    </c:if>
</body>
</html>
```
choose
```
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>JSTL Choose Example</title>
</head>
<body>
    <c:set var="fruit" value="apple" />
    <c:choose>
        <c:when test="${fruit eq 'apple'}">
            <p>It's an apple.</p>
        </c:when>
        <c:when test="${fruit eq 'banana'}">
            <p>It's a banana.</p>
        </c:when>
        <c:otherwise>
            <p>It's not an apple or a banana.</p>
        </c:otherwise>
    </c:choose>
</body>
</html>
```
#### 迭代标签
```
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>JSTL ForEach Example</title>
</head>
<body>
    <c:set var="fruits" value="${['apple', 'banana', 'orange']}" />
    <ul>
        <c:forEach items="${fruits}" var="fruit">
            <li>${fruit}</li>
        </c:forEach>
    </ul>
</body>
</html>
```
## servlet
### servlet生命周期
start->init()->service()->destroy()
### servlet注解
1.@webservlet:用于定义一个Servlet，可以指定Servlet的名称、URL映射等信息
```
@WebServlet(name = "MyServlet", urlPatterns = "/myservlet")//或者@WebServlet("/MyServlet")
public class MyServlet extends HttpServlet {
    // ...
}
```
2.@WebInitParam：用于为Servlet指定初始化参数，可以在Servlet代码中通过getInitParameter()方法获取这些参数的值。
```
@WebServlet(name = "MyServlet", urlPatterns = "/myservlet", initParams = {
        @WebInitParam(name = "username", value = "admin"),
        @WebInitParam(name = "password", value = "123456")})
        
        
public class MyServlet extends HttpServlet {
    // ...
}
```
3.@WebFilter：用于定义一个过滤器，可以指定过滤器的名称、URL映射等信息。
```
@WebFilter(filterName = "MyFilter", urlPatterns = "/*")
public class MyFilter implements Filter {
    // ...
}
```
4.@WebListener：用于定义一个监听器，可以指定监听的事件类型等信息。
```
@WebListener
public class MyContextListener implements ServletContextListener {
    // ...
}
```
### 简单应用
```
@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        
        if ("admin".equals(username) && "123456".equals(password)) {
            request.getRequestDispatcher("welcome.jsp").forward(request, response);
        } else {
            request.setAttribute("errorMsg", "Invalid username or password!");
            request.getRequestDispatcher("index.jsp").forward(request, response);
        }
    }
}
```
## java Bean
Java Bean的基本原则包括以下几点：

1.实现Serializable接口(共有类)：Java Bean类必须实现Serializable接口，以便能够在网络上传输或者在不同的Java应用程序之间进行传递。

2.封装属性：Java Bean类应该将属性封装起来，通过公共的getter和setter方法来访问和修改属性值。

3.提供无参构造器：Java Bean类必须提供一个无参构造器，以便能够通过反射创建实例。

4.实现序列化
常见的三种Java Bean包括：

实体Bean：用于封装数据的Java Bean，通常包含一些属性和对应的getter和setter方法，以及一些辅助方法。entity类

业务Bean：用于提供一些服务的Java Bean，例如计算、数据转换等，通常包含一些公共方法。
业务类，service类
持久化Bean：数据库访问类，dao类

## MVC模式
mvc:model,view,controller
主要目的是将应用程序的业务逻辑和用户界面分离，以便更好地管理和维护代码。

### 好处
![benefit](https://img1.imgtp.com/2023/06/18/RwUcdItS.png)
### 案例
model:
```
public class Student {
    private int id;
    private String name;
    private int age;
    private String gender;

    public Student(int id, String name, int age, String gender) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.gender = gender;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public String getGender() {
        return gender;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }
}
```
#### view
add.jsp
```
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Add Student</title>
</head>
<body>
    <h1>Add Student</h1>
    <form action="addStudent" method="post">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required><br>
        <label for="age">Age:</label>
        <input type="number" id="age" name="age" min="0" required><br>
        <label for="gender">Gender:</label>
        <input type="radio" id="male" name="gender" value="Male" required>
        <label for="male">Male</label>
        <input type="radio" id="female" name="gender" value="Female" required>
        <label for="female">Female</label><br>
        <input type="submit" value="Add">
    </form>
</body>
</html>

```
showlist.jsp
```
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Student List</title>
</head>
<body>
    <h1>Student List</h1>
    <table border="1">
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Actions</th>
        </tr>
        <% for (Student student : studentList) { %>
        <tr>
            <td><%= student.getId() %></td>
            <td><%= student.getName() %></td>
            <td><%= student.getAge() %></td>
            <td><%= student.getGender() %></td>
            <td>
                <a href="deleteStudent?id=<%= student.getId() %>">Delete</a>
                <a href="modifyStudent?id=<%= student.getId() %>">Modify</a>
            </td>
        </tr>
        <% } %>
    </table>
    <br>
    <a href="add.jsp">Add Student</a>
</body>
</html>
```
modify.jsp
```
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Modify Student</title>
</head>
<body>
    <h1>Modify Student</h1>
    <form action="modifyStudent" method="post">
        <input type="hidden" name="id" value="<%= student.getId() %>">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" value="<%= student.getName() %>" required><br>
        <label for="age">Age:</label>
        <input type="number" id="age" name="age" value="<%= student.getAge() %>" min="0" required><br>
        <label for="gender">Gender:</label>
        <input type="radio" id="male" name="gender" value="Male" <% if ("Male".equals(student.getGender())) { %>checked<% } %> required>
        <label for="male">Male</label>
        <input type="radio" id="female" name="gender" value="Female" <% if ("Female".equals(student.getGender())) { %>checked<% } %> required>
        <label for="female">Female</label><br>
        <input type="submit" value="Save">
    </form>
</body>
</html>
```
#### controller
AddStudentServlet.java：添加学生的Servlet
```
public class AddStudentServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 获取用户提交的表单数据
        String name = request.getParameter("name");
        int age = Integer.parseInt(request.getParameter("age"));
        String gender = request.getParameter("gender");

        // 创建Student对象，并将其保存到数据库中
        Student student = new Student(name, age, gender);
        StudentDao studentDao = new StudentDaoImpl();
        studentDao.addStudent(student);

        // 重定向到学生列表页面
        response.sendRedirect("showList");
    }
}
```
ShowListServlet.java
```
public class ShowListServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 查询数据库中所有的学生信息，并将其保存到request对象中
        StudentDao studentDao = new StudentDaoImpl();
        List<Student> studentList = studentDao.getAllStudents();
        request.setAttribute("studentList", studentList);

        // 转发到学生列表页面
        request.getRequestDispatcher("showList.jsp").forward(request, response);
    }
}
```
DeleteStudentServlet.java
```
public class DeleteStudentServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 获取要删除的学生的ID，并将其从数据库中删除
        int id = Integer.parseInt(request.getParameter("id"));
        StudentDao studentDao = new StudentDaoImpl();
        studentDao.deleteStudent(id);

        // 重定向到学生列表页面
        response.sendRedirect("showList");
    }
}
```
ModifyStudentServlet.java
```
public class ModifyStudentServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 获取要修改的学生的ID，并将其从数据库中查询出来
        int id = Integer.parseInt(request.getParameter("id"));
        StudentDao studentDao = new StudentDaoImpl();
        Student student = studentDao.getStudentById(id);

        // 将查询出来的学生信息保存到request对象中
        request.setAttribute("student", student);

        // 转发到修改学生信息页面
        request.getRequestDispatcher("modify.jsp").forward(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 获取用户提交的表单数据
        int id = Integer.parseInt(request.getParameter("id"));
        String name = request.getParameter("name");
        int age = Integer.parseInt(request.getParameter("age"));
        String gender = request.getParameter("gender");

        // 创建Student对象，并更新其在数据库中的信息
        Student student = new Student(id, name, age, gender);
        StudentDao studentDao = new StudentDaoImpl();
        studentDao.updateStudent(student);

        // 重定向到学生列表页面
        response.sendRedirect("showList");
    }
}
```