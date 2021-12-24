<template>
  <div class="content">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片主体内容 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isValid" scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: #89c379"
          ></i>
          <i class="el-icon-error" v-else style="color: #e06c75"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类弹框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addFormReset"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name" clearable></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleCascaderChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹框 -->
    <el-dialog
      title="修改分类信息"
      :visible.sync="editDialogVisible"
      width="40%"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      cateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isValid',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        },
      ],
      addDialogVisible: false,
      addForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0,
      },
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
      },
      selectedKeys: [],
      editDialogVisible: false,
      editForm: {
        cat_name: '',
      },
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log(res)
      this.cateList = res.data.result
      this.total = res.data.total
      // console.log(this.cateList, this.total)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },

    showAddDialog() {
      this.getParentCate()
      this.addDialogVisible = true
    },
    addFormReset() {
      this.$refs.addFormRef.resetFields()
      this.selectedKeys.length = 0
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    async getParentCate() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.parentCateList = res.data
      // console.log(this.parentCateList)
    },
    handleCascaderChange() {
      // console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
    },
    addCate() {
      // console.log(this.addForm)
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }

        const { data: res } = await this.$http.post('categories', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addDialogVisible = false
      })
    },
    async handleEdit(id) {
      console.log(id)
      const { data: res } = await this.$http.get(`categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
      this.editDialogVisible = true
      // console.log(this.editForm)
    },
    editCate() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(
          'categories/' + this.editForm.cat_id,
          {
            cat_name: this.editForm.cat_name,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }

        this.editDialogVisible = false
        this.getCateList()
        this.$message.success('更新分类信息成功')
      })
    },
    handleDelete(id) {
      // console.log(id)
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('categories/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败')
          }
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          this.getCateList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
  created() {
    this.getCateList()
  },
}
</script>
<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
