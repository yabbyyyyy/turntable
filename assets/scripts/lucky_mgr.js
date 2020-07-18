
cc.Class({
    extends: cc.Component,

    properties: {
        item_root:{
            default:null,
            type:cc.Node,
        },

        running_item:{
            default: null,
            type:cc.Node,
        },




    },


    onLoad:function() {
        this.is_running = false;
        this.start_index = Math.random() * this.item_root.childrenCount  ;
        this.start_index = Math.floor(this.start_index);
        this.running_item.setPosition(this.item_root.children[this.start_index].getPosition());
		// 隐藏奖品框
		this.running_item.opacity = 0;


        //绑定label，后续来用打印抽奖结果

        this.myLabel = this.node.getChildByName('logg').getComponent(cc.Label);
        this.myLabel.string ="sdsad";



        // console.log(this.item_root.children)

    },

    update(dt) {
		// 没有设定奖品时不改变数值
        if(this.is_running === false && this.prize){
            // 转圈结束后，再打印抽奖结果
            this.myLabel.string = (this.prize);
            return;
        }
        this.passed_time += dt;
        if(this.passed_time > this.move_time){
            dt -= (this.passed_time - this.move_time);
        }
        this.running_item.x += (this.vx * dt);
        this.running_item.y += (this.vy * dt);

        if(this.passed_time >= this.move_time){
            this.next_step ++;
            this.v -= this.a_v ;
            this.walk_to_next();
        }

    },

    on_start_click: function () {
		// 显示奖品框
		this.running_item.opacity = 255;
        this.end_index = Math.random() * this.item_root.childrenCount  ;
        this.end_index = Math.floor(this.end_index);
        console.log("end =" ,this.end_index +1);
        console.log(this.myLabel.string)
        this.show_anim_result();

        // 点击获得奖品编号后，去读取对应的参数，准备后续的结果打印
        cc.loader.loadRes("./config/results_conf",(err,result)=>{
            if(err){
                cc.log(err);
            }
            else{
                // cc.log("enemy result = "+ JSON.stringify(result));
                let config = result.json[this.end_index];
                // cc.log("enemy 222 = "+ JSON.stringify(result.json[111]));
                this.prize = config.name


            }
        });

        // this.running_item.setPosition(this.item_root.children[this.end_index].getPosition());


    },



    show_anim_result:function () {
      // 处理转圈的路径数
      var round= Math.random() *3 +2;//随机一个转的的圈数
      round = Math.floor(round);   //圈数为整数
      //建立数组，把所有路劲序号添加进来
      this.road_path=[];

      // 把圈数全加进来，  有几圈，就j++几次   这个for循环就是把round的次数转完
      for (var j =0; j< round; j++){
          // 两个循环，i小于路劲数，即（this.item_root.childrenCount），则走完剩下的路径数
          // i大于路劲数则用 i=0重新走一圈
          // 设定 i =start_index  设定每圈的起点为start_index，加到 路径数后，跑下面的for循环；
          // 跑完继续跑下一个j的循环
          for (var i = this.start_index; i<this.item_root.childrenCount;i++){
              this.road_path.push(this.item_root.children[i].getPosition());
              // console.log(this.road_path)
          }

          for (var i = 0; i< this.start_index;i++){
              this.road_path.push(this.item_root.children[i].getPosition());
          }
      }

      // 转弯round次数后， 还要把 start 转到到end的路径加进去，转弯
      if(this.end_index >= this.start_index) {
          //end的选项大于start，就直接添加路劲数
          for (var i = this.start_index; i <= this.end_index; i++) {
              this.road_path.push(this.item_root.children[i].getPosition());
              // console.log(this.road_path)
          }
      }
      else {
          for (var i = this.start_index; i<this.item_root.childrenCount;i++){
              this.road_path.push(this.item_root.children[i].getPosition());
              // console.log(this.road_path)
          }

          for (var i = 0; i<=this.end_index;i++){
              this.road_path.push(this.item_root.children[i].getPosition());
          }
      }

      // 处理转圈的速度
      this.v =5000;//begin speed
      this.a_v =this.v / (this.road_path.length -1);
      this.running_item.setPosition(this.road_path[0]);
      this.next_step =1;

      this.walk_to_next();
    },

    walk_to_next:function () {
        if(this.next_step>=this.road_path.length){
            //next_step>road_path.length 这表示已经走完所有路径了，这时候，start_index就不在随机
            // 出现，而是直接用上一次的end_index
            this.start_index = this.end_index;
            // 转盘转圈状态值设置为 停止
            this.is_running = false;
            return;
        }
        this.is_running = true;
        var f_point = this.running_item.getPosition();
        var s_point = this.road_path[this.next_step];
        // 向量长度
        var dir = s_point.sub(f_point);
        //模长度
        var len = dir.mag();
        this.vx = this.v * dir.x /len;
        this.vy = this.v * dir.y /len;
        // 求时间
        this.move_time = len / this.v;
        this.passed_time = 0;
    },




});
