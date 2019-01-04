// pages/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    richText: '<p><code>keydown</code> 属于键盘事件（<a href="https://www.w3.org/TR/uievents/#events-keyboardevents" target="_blank" rel="noopener">Keyboard Events</a>），当键盘按下某个按键时触发，且默认情况下，长按某按键会重复触发。但事件会判断用户是否长按还是连续按下，因此会有一定延迟（有点类似移动端适配时onclick事件会有300ms延迟）。一般情况下该延迟很难察觉，但在开发JS游戏时，发现该延迟会严重降低游戏体验，给玩家一种十分卡顿的感觉。此时就很有必要解决该问题。</p><a id="more"></a><p>不废话，先看代码逻辑：</p><p>Game 类</p><figure class="highlight javascript"><table><tr><td class="code"><pre><span class="line"><span class="function"><span class="keyword">function</span> <span class="title">Game</span> (<span class="params"></span>) </span>&#123;</span><br><span class="line"> <span class="keyword">this</span>.bindEvent();</span><br><span class="line"> <span class="keyword">this</span>.start();</span><br><span class="line"> <span class="keyword">this</span>.plane = <span class="keyword">new</span> Plane();</span><br><span class="line">&#125;</span><br><span class="line"><span class="comment">//监听事件函数</span></span><br><span class="line">Game.prototype.bindEvent = <span class="function"><span class="keyword">function</span> (<span class="params"></span>) </span>&#123;</span><br><span class="line"> <span class="comment">//这里使用JQuery方法获取DOM</span></span><br><span class="line"> $(<span class="built_in">document</span>).keydown(<span class="function"><span class="keyword">function</span>(<span class="params">event</span>)</span>&#123;</span><br><span class="line"> <span class="keyword">var</span> event = event || <span class="built_in">window</span>.event;</span><br><span class="line"> <span class="keyword">if</span>(event.keyCode == <span class="number">37</span>) &#123;game.plane.left();&#125;</span><br><span class="line"> <span class="keyword">else</span> <span class="keyword">if</span>(event.keyCode == <span class="number">39</span>) &#123;game.plane.right();&#125;</span><br><span class="line"> &#125;)</span><br><span class="line">&#125;</span><br><span class="line"><span class="comment">//主循环函数</span></span><br><span class="line">Game.prototype.start = <span class="function"><span class="keyword">function</span> (<span class="params"></span>) </span>&#123;</span><br><span class="line"> <span class="keyword">var</span> timer = setInterval(<span class="function"><span class="keyword">function</span>(<span class="params"></span>)</span>&#123;</span><br><span class="line"> game.plane.render();</span><br><span class="line"> &#125;)</span><br><span class="line">&#125;</span><br></pre></td></tr></table></figure><p>Plane 类</p><figure class="highlight javascript"><table><tr><td class="code"><pre><span class="line">Plane.prototype.render = <span class="function"><span class="keyword">function</span> (<span class="params"></span>) </span>&#123;</span><br><span class="line">game.ctx.drawImage(<span class="keyword">this</span>.plane,<span class="keyword">this</span>.x,game.canvas.height - <span class="number">124</span> - <span class="number">20</span>);</span><br><span class="line">&#125;</span><br><span class="line"><span class="comment">//飞机左移</span></span><br><span class="line">Plane.prototype.left = <span class="function"><span class="keyword">function</span> (<span class="params"></span>) </span>&#123;</span><br><span class="line"><span class="keyword">this</span>.x -=<span class="number">5</span>;</span><br><span class="line"><span class="keyword">if</span>(<span class="keyword">this</span>.x &lt;= <span class="number">0</span>)&#123;</span><br><span class="line"><span class="keyword">this</span>.x = <span class="number">0</span>;</span><br><span class="line">&#125;</span><br><span class="line">&#125;</span><br><span class="line"><span class="comment">//飞机右移</span></span><br><span class="line">Plane.prototype.right = <span class="function"><span class="keyword">function</span> (<span class="params"></span>) </span>&#123;</span><br><span class="line"><span class="keyword">this</span>.x +=<span class="number">5</span>;</span><br><span class="line"><span class="keyword">if</span>(<span class="keyword">this</span>.x &gt;= game.canvas.width - <span class="number">100</span>)&#123;</span><br><span class="line"><span class="keyword">this</span>.x = game.canvas.width - <span class="number">100</span>;</span><br><span class="line">&#125;</span><br><span class="line">&#125;</span><br></pre></td></tr></table></figure><p><code>throttle</code> 和 <code>debounce</code> 是解决请求和响应速度不匹配问题的两个方案。二者的差异在于选择不同的策略。</p><h1 id="参考"><a href="#参考" class="headerlink" title="参考"></a>参考</h1><ul><li><a href="https://www.w3.org/TR/uievents/#events-keyboardevents" target="_blank" rel="noopener">W3关于keyboardevents的解释</a></li><li><a href="https://blog.coding.net/blog/the-difference-between-throttle-and-debounce-in-underscorejs" target="_blank" rel="noopener">浅谈 Underscore.js 中 _.throttle 和 _.debounce 的差异</a></li></ul><p>本文完。</p>'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})