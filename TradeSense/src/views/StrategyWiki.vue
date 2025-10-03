<template>
  <section class="strategy-wiki">
    <el-card shadow="never" class="strategy-wiki__card">
      <div class="strategy-wiki__header">
        <h2>策略百科</h2>
        <p>收录主流量化策略的核心信息，了解其适用场景、优势与风险，协助快速对比并选择合适的交易方案。</p>
      </div>

      <el-alert
        type="info"
        show-icon
        :closable="false"
        class="strategy-wiki__alert"
        title="提示"
        description="策略介绍仅供教育参考，实盘操作需结合风控、仓位管理与个人风险承受能力。"
      />

      <div class="strategy-wiki__grid">
        <el-card
          v-for="strategy in strategies"
          :key="strategy.name"
          shadow="hover"
          class="strategy-wiki__item"
        >
          <div class="strategy-wiki__item-header">
            <h3>{{ strategy.name }}</h3>
            <el-tag size="small" type="info">{{ strategy.category }}</el-tag>
          </div>

          <p class="strategy-wiki__summary">{{ strategy.summary }}</p>

          <ul class="strategy-wiki__list">
            <li><strong>适用场景：</strong>{{ strategy.context }}</li>
            <li><strong>优势亮点：</strong>{{ strategy.pros }}</li>
            <li><strong>风险提示：</strong>{{ strategy.cons }}</li>
            <li v-if="strategy.metrics"><strong>常用指标：</strong>{{ strategy.metrics }}</li>
            <li v-if="strategy.notes"><strong>补充说明：</strong>{{ strategy.notes }}</li>
          </ul>

          <div class="strategy-wiki__footer">
            <el-tag
              v-for="tag in strategy.tags"
              :key="tag"
              size="small"
              effect="light"
            >
              {{ tag }}
            </el-tag>
          </div>
        </el-card>
      </div>
    </el-card>
  </section>
</template>

<script setup>
const strategies = [
  {
    name: '双均线交叉策略',
    category: '趋势跟随',
    summary: '通过短期与长期均线交叉识别趋势拐点，适合捕捉中短期方向。',
    context: '趋势初期或趋势延续阶段，尤其是行情刚刚突破关键位时。',
    pros: '信号直观、易于执行，可配合分批建仓提升稳定性。',
    cons: '在震荡行情中可能出现假信号，需要结合波动率或仓位控制。',
    metrics: 'MA12、MA26、成交量、价格通道',
    notes: '可配合斐波那契回调或支撑/阻力位确认。',
    tags: ['均线', '趋势', '日内/波段']
  },
  {
    name: 'RSI 震荡策略',
    category: '震荡反转',
    summary: '利用 RSI 指标判定资产是否超买或超卖，从而进行逆势或顺势操作。',
    context: '横盘整理或箱体震荡行情，价格在区间内来回波动时效果更佳。',
    pros: '信号灵敏、适合短线高频调仓，可快速响应市场过热/过冷。',
    cons: '趋势行情可能持续超买/超卖，需结合趋势判别指标使用。',
    metrics: 'RSI(14)、布林带、ATR、成交量',
    notes: '可配合分批建仓、止盈止损规则提高胜率。',
    tags: ['震荡', '逆势', '短线']
  },
  {
    name: '动量突破策略',
    category: '动量交易',
    summary: '观察价格在指定周期内的涨跌幅与动量变化，顺势跟随加速段。',
    context: '行情放量突破或加速阶段，适合捕捉快速拉升或下挫。',
    pros: '能快速抓住趋势启动点，适合波动较大的加密资产。',
    cons: '需要严格的止损管理，避免追涨杀跌；对假突破较敏感。',
    metrics: 'ROC12、ROC24、成交量、VWAP、SAR',
    notes: '可配合市场深度、资金流向等数据过滤假突破。',
    tags: ['动量', '突破', '高波动']
  },
  {
    name: '布林带通道策略',
    category: '波动率',
    summary: '利用布林带上、中、下轨识别超买超卖状态，兼顾趋势与震荡。',
    context: '震荡市中进行低吸高抛，或在突破布林带时确认趋势。',
    pros: '兼顾价格与波动率信息，可自动适应不同波动状态。',
    cons: '需要配合趋势确认指标，避免在单边行情中做逆势操作。',
    metrics: '布林带(20,2)、RSI、MACD',
    notes: '可搭配双均线或成交量指标确认突破有效性。',
    tags: ['波动率', '通道', '多用途']
  },
  {
    name: 'MACD 趋势策略',
    category: '趋势跟随',
    summary: '通过 DIF 与 DEA 的交叉以及零轴位置判定趋势强弱与拐点。',
    context: '中期趋势运行中，用于确认顺势加仓或提前识别背离信号。',
    pros: '兼顾趋势与动量特征，适合波段持仓。',
    cons: '对极端震荡不敏感，背离信号可能提前失效。',
    metrics: 'MACD、信号线、柱状图、成交量',
    notes: '与均线或布林带组合可提高过滤假信号能力。',
    tags: ['趋势', '波段', '背离']
  },
  {
    name: '一目均衡云策略',
    category: '趋势判定',
    summary: '通过领先/滞后线与云区位置综合判断趋势方向与支撑阻力。',
    context: '适合中长线趋势行情，关注价格与云区的关系。',
    pros: '将支撑阻力、趋势、动量合并在一个指标中。',
    cons: '指标参数较多，初学者理解成本较高；震荡市信号混乱。',
    metrics: '基准线、转换线、先行 A/B、迟行线',
    notes: '与价格形态或成交量指标配合使用效果更佳。',
    tags: ['趋势', '中线', '多指标']
  },
  {
    name: '均值回归配对交易',
    category: '统计套利',
    summary: '选择高度相关的两种资产，当价差偏离均值时进行多空对冲。',
    context: '低波动或稳态市场，适用于相关性较强的币对或股票。',
    pros: '风险相对可控，不依赖单边行情；适合量化程序化执行。',
    cons: '需要持续监控相关性变化，极端行情可能导致价差失效。',
    metrics: '价差均值、标准差、协整检验、z-score',
    notes: '需搭配资金管理和强制平仓机制，避免价差失控。',
    tags: ['均值回归', '对冲', '套利']
  },
  {
    name: '网格交易策略',
    category: '结构化交易',
    summary: '在设定价格区间内布置买卖挂单，通过波动频繁捕捉价差收益。',
    context: '震荡行情或箱体结构，波动率稳定时收益较稳。',
    pros: '执行简单，可自动化运行；适合长期被动获利。',
    cons: '单边行情可能造成浮亏，需要资金预留和止损机制。',
    metrics: '网格间距、仓位配比、资金利用率',
    notes: '建议结合趋势判断，在极端行情提前收缩网格或触发止损。',
    tags: ['震荡', '被动收益', '机器人']
  },
  {
    name: '均值回归震荡策略',
    category: '震荡反转',
    summary: '使用价格偏离均值的幅度作为买卖信号，快速捕捉波动回归。',
    context: '高频震荡市场或低时间级别交易。',
    pros: '交易频次高、可实现稳定收益，适合算法交易。',
    cons: '需要高速执行与较低手续费，极端行情易触发连损。',
    metrics: 'Z-Score、均线、标准差、ATR',
    notes: '与波动率过滤器或成交量过滤结合，减少假信号。',
    tags: ['均值回归', '高频', '震荡']
  },
  {
    name: '资金费率套利',
    category: '套利',
    summary: '利用永续合约资金费率与现货/期货价差，构建多空对冲锁定收益。',
    context: '资金费率偏离历史均值时执行，对冲风险后持有到期。',
    pros: '收益相对稳定，与市场方向相关性低。',
    cons: '需要充足资金与风控措施，对交易所风险与杠杆要求高。',
    metrics: '资金费率、基差、年化收益',
    notes: '需实时监控交易所规则与保证金水平，防范系统性风险。',
    tags: ['套利', '对冲', '低风险']
  }
]
</script>

<style scoped>
.strategy-wiki {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.strategy-wiki__card {
  padding: 24px;
}

.strategy-wiki__header {
  margin-bottom: 16px;
}

.strategy-wiki__header h2 {
  margin: 0 0 8px;
  font-size: 26px;
}

.strategy-wiki__header p {
  margin: 0;
  color: #606266;
}

.strategy-wiki__alert {
  margin-bottom: 16px;
}

.strategy-wiki__grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.strategy-wiki__item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 260px;
}

.strategy-wiki__item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.strategy-wiki__item-header h3 {
  margin: 0;
  font-size: 20px;
}

.strategy-wiki__summary {
  margin: 0;
  color: #606266;
}

.strategy-wiki__list {
  margin: 0;
  padding-left: 18px;
  color: #303133;
}

.strategy-wiki__list li {
  margin: 4px 0;
  line-height: 1.6;
}

.strategy-wiki__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

@media (max-width: 1024px) {
  .strategy-wiki__card {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .strategy-wiki__card {
    padding: 16px;
  }

  .strategy-wiki__header h2 {
    font-size: 22px;
  }

  .strategy-wiki__header p {
    font-size: 14px;
  }

  .strategy-wiki__grid {
    grid-template-columns: 1fr;
  }

  .strategy-wiki__item {
    min-height: auto;
  }

  .strategy-wiki__item-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .strategy-wiki__summary {
    font-size: 14px;
  }
}

</style>
