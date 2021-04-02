import { 
    Button, Icon,Input,Radio,Card,Menu,Layout,Space,Breadcrumb,Table,Spin,Avatar,Dropdown, message,Row,Col,Select,ConfigProvider,Checkbox,Badge,Tooltip,Modal,Form,Steps,Popover,Cascader,Timeline,DatePicker,Popconfirm,Anchor,Upload,Tabs,InputNumber,Tag,Tree, List, Divider,Descriptions,Drawer,Carousel,AutoComplete,Switch
} from 'ant-design-vue';

export default app => {
    //绑定全局方法
    app.config.globalProperties.$message = message;
    app.config.globalProperties.$modal = Modal;
    app.use(Button);
    app.use(Icon);
    app.use(Input);
    app.use(Radio);
    app.use(Card);
    app.use(Menu);
    app.use(Layout);
    app.use(Space);
    app.use(Breadcrumb);
    app.use(Table);
    app.use(Spin);
    app.use(Avatar);
    app.use(Dropdown);
    app.use(Row);
    app.use(Col);
    app.use(Select);
    app.use(ConfigProvider);
    app.use(Checkbox);
    app.use(Badge);
    app.use(Tooltip);
    app.use(Modal);
    app.use(Steps);
    app.use(Form);
    app.use(Popover);
    app.use(Cascader);
    app.use(Timeline);
    app.use(DatePicker);
    app.use(Popconfirm);
    app.use(Anchor);
    app.use(Upload);
    app.use(Tabs);
    app.use(InputNumber);
    app.use(Tag);
    app.use(List);
    app.use(Divider);
    app.use(Tree);
    app.use(Descriptions);
    app.use(Drawer);
    app.use(Carousel);
    app.use(AutoComplete);
    app.use(Switch);

}