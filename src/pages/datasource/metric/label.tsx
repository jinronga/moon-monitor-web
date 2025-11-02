import { MetadataItemLabel, TeamMetricDatasourceMetadataItem } from '@/api/common.types'
import { MetricType } from '@/api/enum'
import { MetricTypeData } from '@/api/global'
import { GlobalContext } from '@/utils/context'
import { message, Modal, ModalProps, Space, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Network } from 'lucide-react'
import React, { useContext } from 'react'

export interface LabelProps extends ModalProps {
  metricDetail?: TeamMetricDatasourceMetadataItem
}

export const Label: React.FC<LabelProps> = (props) => {
  const { theme } = useContext(GlobalContext)
  const { metricDetail, open, onCancel, onOk } = props

  const columns: ColumnsType<MetadataItemLabel> = [
    {
      title: '标签名',
      dataIndex: 'key',
      key: 'key',
      ellipsis: true,
      width: '40%',
      render(_, record) {
        return (
          <div
            className='text-sm text-gray-500'
            onClick={() => {
              navigator.clipboard.writeText(record.key).then(() => {
                message.success('复制成功')
              })
            }}
          >
            {record.key}
          </div>
        )
      }
    },
    {
      title: '标签值',
      dataIndex: 'values',
      key: 'values',
      ellipsis: true,
      width: '60%',
      render(_, record) {
        return (
          <Space size={4} wrap>
            {record.values.map((item, index) => (
              <Tag
                key={`${index}-${item}`}
                bordered={false}
                onClick={() => {
                  navigator.clipboard.writeText(item).then(() => {
                    message.success('复制成功')
                  })
                }}
                className={
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 transition-colors'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors'
                }
              >
                {item}
              </Tag>
            ))}
          </Space>
        )
      }
    }
  ]

  const getMetricType = (metricType?: string | number) => {
    if (!metricType) {
      return {
        color: 'gray',
        text: '未知'
      }
    }
    // 如果是字符串，根据文本值映射
    if (typeof metricType === 'string') {
      const typeLower = metricType.toLowerCase()
      if (typeLower === 'counter') {
        return { color: 'green', text: 'Counter' }
      } else if (typeLower === 'gauge') {
        return { color: 'blue', text: 'Gauge' }
      } else if (typeLower === 'histogram') {
        return { color: 'purple', text: 'Histogram' }
      } else if (typeLower === 'summary') {
        return { color: 'orange', text: 'Summary' }
      }
      return { color: 'default', text: metricType }
    }
    // 如果是数字，从 MetricTypeData 获取
    const typeData = MetricTypeData[metricType as MetricType]
    return typeData || { color: 'default', text: String(metricType) }
  }

  return (
    <>
      <Modal
        title={
          <Space>
            <Network className='h-6 w-6 text-blue-500' />
            {metricDetail?.name}
            {metricDetail?.type && (() => {
              const typeInfo = getMetricType(metricDetail.type)
              return typeInfo ? <Tag color={typeInfo.color}>{typeInfo.text}</Tag> : null
            })()}
          </Space>
        }
        width='60%'
        open={open}
        onCancel={onCancel}
        onOk={onOk}
        footer={false}
      >
        <Table
          size='small'
          pagination={false}
          scroll={{ y: 400, x: true }}
          columns={columns}
          dataSource={metricDetail?.labels}
        />
      </Modal>
    </>
  )
}
