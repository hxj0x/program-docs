### 高级搜索
```tsx
import React, { useState, useCallback } from 'react';
import { 
  PlusOutlined, DeleteOutlined, SearchOutlined, 
  FilterOutlined, BlockOutlined, CodeOutlined 
} from '@ant-design/icons';
import { 
  Select, Input, Button, Space, Card, 
  InputNumber, DatePicker, ConfigProvider 
} from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

// --- 1. 配置抽离：易于维护与扩展 ---
const FIELD_MAP = {
  uuid: { label: 'ID', type: 'text' },
  username: { label: '用户名', type: 'text' },
  age: { label: '年龄', type: 'number' },
  status: { label: '状态', type: 'select', options: ['正常', '禁用', '审核中'] },
  role: { label: '角色', type: 'multi', options: ['管理员', '编辑', '访客'] },
  created_at: { label: '创建日期', type: 'date' },
};

const OP_MAP = {
  text: [{ label: '包含', value: 'cnt' }, { label: '等于', value: 'eq' }],
  number: [{ label: '等于', value: 'eq' }, { label: '>', value: 'gt' }, { label: '<', value: 'lt' }],
  select: [{ label: '是', value: 'is' }],
  multi: [{ label: '属于', value: 'in' }],
  date: [{ label: '范围', value: 'range' }, { label: '当天', value: 'on' }]
};

// --- 2. 工具函数：递归更新 ---
const updateTree = (nodes, id, payload) => nodes.map(n => {
  if (n.id === id) return { ...n, ...payload };
  if (n.type === 'group') return { ...n, children: updateTree(n.children, id, payload) };
  return n;
});

const filterTree = (nodes, id) => nodes.filter(n => {
  if (n.id === id) return false;
  if (n.type === 'group') {
    n.children = filterTree(n.children, id);
  }
  return true;
});

// --- 3. 核心子组件 ---
const ValueRenderer = ({ rule, onUpdate }) => {
  const cfg = FIELD_MAP[rule.field];
  const val = rule.value;

  const onChange = v => onUpdate(rule.id, { value: v?.target ? v.target.value : v });

  if (rule.operator === 'range') return <DatePicker.RangePicker size="small" className="w-52" onChange={onChange} />;
  
  switch (cfg.type) {
    case 'number': return <InputNumber size="small" className="w-20" value={val} onChange={onChange} />;
    case 'date': return <DatePicker size="small" className="w-32" onChange={onChange} />;
    case 'select':
    case 'multi':
      return (
        <Select 
          size="small" 
          mode={cfg.type === 'multi' ? 'multiple' : undefined} 
          className="min-w-[100px] max-w-[180px]"
          value={val} 
          onChange={onChange}
        >
          {cfg.options.map(o => <Option key={o} value={o}>{o}</Option>)}
        </Select>
      );
    default: return <Input size="small" className="w-32" value={val} placeholder="输入..." onChange={onChange} />;
  }
};

const RuleItem = ({ rule, onUpdate, onDelete }) => (
  <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded shadow-sm hover:border-blue-400 transition-colors group">
    <Select 
      size="small" 
      variant="borderless" 
      className="w-28 font-semibold"
      value={rule.field}
      onChange={v => onUpdate(rule.id, { field: v, operator: OP_MAP[FIELD_MAP[v].type][0].value, value: undefined })}
    >
      {Object.entries(FIELD_MAP).map(([k, v]) => <Option key={k} value={k}>{v.label}</Option>)}
    </Select>
    
    <Select 
      size="small" 
      variant="borderless" 
      className="w-20 text-blue-600 font-bold"
      value={rule.operator}
      onChange={v => onUpdate(rule.id, { operator: v })}
    >
      {OP_MAP[FIELD_MAP[rule.field].type].map(o => <Option key={o.value} value={o.value}>{o.label}</Option>)}
    </Select>

    <ValueRenderer rule={rule} onUpdate={onUpdate} />

    <Button 
      type="text" size="small" danger icon={<DeleteOutlined />} 
      className="opacity-0 group-hover:opacity-100" 
      onClick={() => onDelete(rule.id)} 
    />
  </div>
);

const GroupNode = ({ group, isRoot, onUpdate, onDelete, onAdd }) => {
  const isOr = group.conjunction === 'OR';
  
  return (
    <div className={`flex gap-3 ${!isRoot ? 'my-3 w-full' : ''}`}>
      {/* 侧边逻辑条 */}
      <div className="flex flex-col items-center">
        <div 
          className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer shadow-sm font-bold transition-colors ${isOr ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'}`}
          onClick={() => onUpdate(group.id, { conjunction: isOr ? 'AND' : 'OR' })}
        >
          {isOr ? '或' : '且'}
        </div>
        <div className={`flex-grow w-px my-1 ${isOr ? 'bg-orange-200' : 'bg-blue-200'}`} />
      </div>

      <div className="flex-grow">
        <div className="flex flex-wrap items-center gap-2">
          {group.children.map(child => (
            child.type === 'rule' 
              ? <RuleItem key={child.id} rule={child} onUpdate={onUpdate} onDelete={onDelete} />
              : <div key={child.id} className="w-full pl-2"><GroupNode group={child} onUpdate={onUpdate} onDelete={onDelete} onAdd={onAdd} /></div>
          ))}
          
          <Space size={4} className="ml-2">
            <Button size="small" icon={<PlusOutlined />} onClick={() => onAdd(group.id, 'rule')}>条件</Button>
            <Button size="small" icon={<BlockOutlined />} onClick={() => onAdd(group.id, 'group')}>小组</Button>
            {!isRoot && <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(group.id)} />}
          </Space>
        </div>
      </div>
    </div>
  );
};

// --- 4. 主入口 ---
export default function App() {
  const [query, setQuery] = useState({
    id: 'root', type: 'group', conjunction: 'AND',
    children: [{ id: '1', type: 'rule', field: 'username', operator: 'cnt', value: '' }]
  });
  const [jsonVisible, setJsonVisible] = useState(false);

  const onUpdate = useCallback((id, payload) => {
    setQuery(prev => {
      if (prev.id === id) return { ...prev, ...payload };
      return { ...prev, children: updateTree(prev.children, id, payload) };
    });
  }, []);

  const onDelete = useCallback(id => {
    setQuery(prev => ({ ...prev, children: filterTree(prev.children, id) }));
  }, []);

  const onAdd = useCallback((parentId, type) => {
    const id = `n_${Date.now()}`;
    const newNode = type === 'rule' 
      ? { id, type: 'rule', field: 'username', operator: 'cnt', value: '' }
      : { id, type: 'group', conjunction: 'AND', children: [{ id: `${id}_1`, type: 'rule', field: 'username', operator: 'cnt', value: '' }] };
    
    setQuery(prev => {
      if (prev.id === parentId) return { ...prev, children: [...prev.children, newNode] };
      return { ...prev, children: updateTree(prev.children, parentId, { 
        children: [...(prev.children.find(c => c.id === parentId)?.children || []), newNode] 
      }) };
    });
  }, []);

  return (
    <ConfigProvider theme={{ token: { borderRadius: 4, colorPrimary: '#2563eb' } }}>
      <div className="min-h-screen bg-slate-50 p-8">
        <Card 
          className="max-w-5xl mx-auto shadow-md border-slate-200"
          title={<div className="flex items-center gap-2"><FilterOutlined /><span>高级检索</span></div>}
          extra={<Space><Button size="small" onClick={() => setJsonVisible(!jsonVisible)} icon={<CodeOutlined />}>JSON</Button><Button type="primary" icon={<SearchOutlined />}>搜索</Button></Space>}
        >
          <div className="bg-white p-4 rounded border border-slate-100">
            <GroupNode group={query} isRoot onUpdate={onUpdate} onDelete={onDelete} onAdd={onAdd} />
          </div>

          {jsonVisible && (
            <pre className="mt-4 p-4 bg-slate-800 text-slate-300 text-xs rounded-lg overflow-auto max-h-60">
              {JSON.stringify(query, null, 2)}
            </pre>
          )}
        </Card>
      </div>
    </ConfigProvider>
  );
}
```
