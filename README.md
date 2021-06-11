# 描述
javascript图片查看器，无任何依赖库
<br />
支持 拖动、缩放、任意角度旋转、鼠标滚轮

# 浏览器支持
IE 6+ 
<br />
Chrome 
<br />
FireFox 
<br />
Edge
<br />
Others(支持css3动画的浏览器) 

#demo
[点击这里查看示例](http://feilong2014.github.io/FeiImageView/viewpanel.html)

#other
交流邮箱 287449943@qq.com

#api
Config:
<table>
    <tbody>
        <tr>
            <th></th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>images</td>
            <td>Array</td>
            <td>[]</td>
            <td>Image List</td>
        </tr>
        <tr>
            <td>currentIndex</td>
            <td>Number</td>
            <td>0</td>
            <td>默认显示第几张图片</td>
        </tr>
    </tbody>
</table>
Method：
<table>
    <tbody>
        <tr>
            <th></th>
            <th>Params</th>
            <th>Return</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>render</td>
            <td>{ HTMLElement } 容器父级元素</td>
            <td>{ Object } fImagePanel对象</td>
            <td>渲染</td>
        </tr>
        <tr>
            <td>setImages</td>
            <td>{ Array } 图片地址的数组</td>
            <td>{ Object } fImagePanel对象</td>
            <td>设置图片列表</td>
        </tr>
        <tr>
            <td>doChange</td>
            <td></td>
            <td>{ Object } fImagePanel对象</td>
            <td>应用图片样式变动 其余方法只负责算出变动值 必须调用doChange方法才能将样式变动提现到dom元素上边</td>
        </tr>
        <tr>
            <td>stretchH</td>
            <td></td>
            <td>{ Object } fImagePanel对象</td>
            <td>垂直拉伸</td>
        </tr>
        <tr>
            <td>stretchV</td>
            <td></td>
            <td>{ Object } fImagePanel对象</td>
            <td>水平拉伸</td>
        </tr>
        <tr>
            <td>originalOptimally</td>
            <td></td>
            <td>{ Object } fImagePanel对象</td>
            <td>原始尺寸</td>
        </tr>
        <tr>
            <td>stretchOptimally</td>
            <td></td>
            <td>{ Object } fImagePanel对象</td>
            <td>最佳显示</td>
        </tr>
        <tr>
            <td>centerImage</td>
            <td></td>
            <td>{ Object } fImagePanel对象</td>
            <td>图片居中</td>
        </tr>
        <tr>
            <td>rotate</td>
            <td>{ Number } 角度 例如: 90</td>
            <td>{ Object } fImagePanel对象</td>
            <td>旋转</td>
        </tr>
        <tr>
            <td>scale</td>
            <td>{ Number } 倍数 如 1.1 or 0.9</td>
            <td>{ Object } fImagePanel对象</td>
            <td>放大 缩小</td>
        </tr>
        <tr>
            <td>switchTo</td>
            <td>{ Number } index</td>
            <td>{ Object } fImagePanel对象</td>
            <td>切换图片</td>
        </tr>
        <tr>
            <td>nextImage</td>
            <td></td>
            <td>{ Object } fImagePanel对象</td>
            <td>下一张</td>
        </tr>
        <tr>
            <td>upImage</td>
            <td></td>
            <td>{ Object } fImagePanel对象</td>
            <td>上一张</td>
        </tr>
    </tbody>
</table>

#截图
<img src='images/tu.png' />
