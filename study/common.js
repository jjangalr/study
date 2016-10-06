(function(w) {
	var _es = {};

	function uri(p, c) {
		var s = '' + p;
		if(c) {
			s = s + '?v=' + v();
		}
		return s;
	}

	function v() {
		return(new Date).getTime()+(Math.floor(Math.random()*100)+1);
	}

	_es.loading = function() {
		var _c = 0, _m = '·ÎµùÁß...';
	
		init();
		
		function init() {
			if(!$('#ui-loading').length){
				$('body').append('<div id="ui-loading" class="ui-loading" style="display:none"><div class="dimmed" style="display:block;z-index:99999;"></div><div class="ui-loading-m" style="z-index:99999;">'+_m+'</div></div>');
			}
		}

		function on() {
			_c++;
			setTimeout(function(){
				_c && $('#ui-loading').css('display','block')
			}, 1);
		}

		function off() {
			_c--;
			if(_c<1){
				_c=0;
				$('#ui-loading').css('display','none');
			}
		}

		function clear() {
			_c=0;
			off();
		}
	}();
	
	//ajax
	_es.ajax = function() {
		function html(url, sync, cache) {
			var d=$.Deferred();
			
			if(url) {
				$.ajax({
					 async:!sync
				   , type:cache?'get':'post'
				   , contentType:'text/html'
				   , url:uri(url, cache)
				   , success:d.resolve
				   , error:function(){d.resolve(null)}
				});
			} else {
				d.resolve(null);
			}

			return d.promise();
		}
		
		function get(url,pm,sync,cache) {
			var d=$.Deferred();
			
			if(url) {
				$.ajax({
					 async:!sync
				   , type:'get'
				   , contentType:'application/json'
				   , url:uri(url, cache)
				   , data:serialize(pm)
				   , success:function(data){d.resolve({data:data||{},status:200})}
				   , error:function(r){d.resolve({status:r.status==200?500:r.status})}
				});
			} else {
				d.resolve(null);
			}

			return d.promise();
		}

		function post(url,pm,sync) {
			var d=$.Deferred();
			
			if(url) {
				$.ajax({
					 async:!sync
				   , type:'get'
				   , contentType:'application/json'
				   , url:uri(url)
				   , data:JSON.stringify(pm)
				   , success:function(data){d.resolve({data:data||{},status:200})}
				   , error:function(r){d.resolve({status:r.status==200?500:r.status,data:r.responseText})}
				});
			} else {
				d.resolve(null);
			}

			return d.promise();
		}

		function form(url,pm,sync) {
			var d=$.Deferred();
			
			if(url) {
				$.ajax({
					 async:!sync
				   , type:'post'
				   , contentType:'application/x-www-form-urlencoded;charset=utf-8'
				   , url:uri(url)
				   , data:serialize(pm)
				   , success:function(data){d.resolve({data:data||{},status:200})}
				   , error:function(r){d.resolve({status:r.status==200?500:r.status})}
				});
			} else {
				d.resolve(null);
			}

			return d.promise();
		}

		function serialize(data){
			return _.map(data,function(v,k){return [k,'=',v].join('');}).join('&');
		}

		return {
			html:html
		  , get:get
		  , post:post
		  , form:form
		};
	}();

	_es.http = function(url, pm, loading) {
		loading && _es.loading.on();

		var d=$.Deferred();

		function request(url, pm, loading) {
			_es.ajax.post(url, pm, false).then(function(rs) {
				loading&&uiloading.off();
				d.resolve(rs);
			});

			return d.promise();
		}

		return {
			request:request
		};
	}();
	

	w._es = _es;
})(window);