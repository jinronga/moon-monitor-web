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
      return MetricTypeData[MetricType.MetricTypeUnknown] || {
        color: 'gray',
        text: '未知'
      }
    }

    // 字符串到 MetricType 枚举的映射
    const stringToMetricType: Record<string, MetricType> = {
      counter: MetricType.MetricTypeCounter,
      gauge: MetricType.MetricTypeGauge,
      histogram: MetricType.MetricTypeHistogram,
      summary: MetricType.MetricTypeSummary
    }

    let typeEnum: MetricType

    // 如果是字符串，转换为枚举值
    if (typeof metricType === 'string') {
      const typeLower = metricType.toLowerCase()
      typeEnum = stringToMetricType[typeLower] || MetricType.MetricTypeUnknown
    } else {
      // 如果是数字，直接使用
      typeEnum = metricType as MetricType
    }

    // 统一从 MetricTypeData 获取数据
    const typeData = MetricTypeData[typeEnum]
    return typeData || MetricTypeData[MetricType.MetricTypeUnknown] || {
      color: 'default',
      text: String(metricType)
    }
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
