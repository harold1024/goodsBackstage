<template>
	<div :class="classObj" class="">
		<div  class="sidebar-container">
        <el-scrollbar class="scrollbar-wrapper">
		
		<el-menu
			default-active="1-4-1"
			class="el-menu-vertical-demo"
			@open="handleOpen"
			@close="handleClose"
			:collapse="isCollapse"
			unique-opened
			router
			background-color="#545c64"
			text-color="#fff"
			active-text-color="#ffd04b"
		>
			<el-submenu index="home">
				<template slot="title">
					<i class="el-icon-location"></i>
					<span slot="title">首页</span>
				</template>
				<el-menu-item index="home" class="detailed">统计功能</el-menu-item>
			</el-submenu>
			<el-menu-item index="etieControl">
				<i class="el-icon-menu"></i>
				<span slot="title">导航二</span>
			</el-menu-item>
			<el-submenu index="goods">
				<template slot="title">
					<i class="el-icon-location"></i>
					<span slot="title">商品</span>
				</template>
				<el-menu-item index="goods" class="detailed">添加商品</el-menu-item>
				<el-menu-item index="goodsList" class="detailed">商品列表</el-menu-item>
			</el-submenu>
		</el-menu>
		</el-scrollbar>
		</div>
        
		<div :class="{ hasTagsView: isCollapse }" class="main-container">
            <div class="header">
            <el-radio-group v-model="isCollapse">
			<el-radio-button :label="false">打开</el-radio-button>
			<el-radio-button :label="true">关闭</el-radio-button>
		</el-radio-group>
            </div>
            <keep-alive include="Customer">
                <router-view />
            </keep-alive>
		</div>
	</div>
</template>

<script>
export default {
	name: "Sidebar",
	data() {
		return {
		isCollapse: false
		};
    },
    computed: {
        classObj(){
            return {
                hideSidebar: this.isCollapse,
                openSidebar: !this.isCollapse,
            }
        }
    },
	methods: {
		handleOpen(key, keyPath) {
		console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
		console.log(key, keyPath);
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
  position: relative;
  overflow: hidden;
}
.scrollbar-wrapper {
  overflow-x: hidden !important;
}
.sidebar-container {
        transition: width 0.28s;
        width: $sideBarWidth !important;
        background-color: $menuBg;
        height: 100%;
        position: fixed;
        font-size: 0px;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1001;
        overflow: hidden;
        // reset element-ui css
        .horizontal-collapse-transition {
            transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
        }
        .scrollbar-wrapper {
            overflow-x: hidden !important;
        }
        .el-scrollbar__bar.is-vertical {
            right: 0px;
        }
        .el-scrollbar {
            height: 100%;
        }
        &.has-logo {
            .el-scrollbar {
                height: calc(100% - 50px);
            }
        }
        .is-horizontal {
            display: none;
        }
        a {
            display: inline-block;
            width: 100%;
            overflow: hidden;
        }
        .svg-icon {
            margin-right: 16px;
        }
        .el-menu {
            border: none;
            height: 100%;
            width: 100% !important;
        }
        // menu hover
        .submenu-title-noDropdown,
        .el-submenu__title {
            &:hover {
                background-color: $menuHover !important;
            }
        }
        .is-active>.el-submenu__title {
            color: $subMenuActiveText !important;
        }
        & .nest-menu .el-submenu>.el-submenu__title,
        & .el-submenu .el-menu-item {
            min-width: $sideBarWidth !important;
            background-color: $subMenuBg !important;
            &:hover {
                background-color: $subMenuHover !important;
            }
        }
    }
    .hideSidebar {
        .sidebar-container {
            width: 64px !important;
        }
        .main-container {
            margin-left: 64px;
        }
        .submenu-title-noDropdown {
            padding: 0 !important;
            position: relative;
            .el-tooltip {
                padding: 0 !important;
                .svg-icon {
                    margin-left: 20px;
                }
            }
        }
        .el-submenu {
            overflow: hidden;
            &>.el-submenu__title {
                // padding: 0 !important;
                .svg-icon {
                    margin-left: 20px;
                }
                .el-submenu__icon-arrow {
                    display: none;
                }
            }
        }
        .el-menu--collapse {
            .el-submenu {
                &>.el-submenu__title {
                    &>span {
                        height: 0;
                        width: 0;
                        overflow: hidden;
                        visibility: hidden;
                        display: inline-block;
                    }
                }
            }
        }
    }
    .header{
        width: 100%;
        height: 50px;
        border: 1px solid #333;
    }
</style>
