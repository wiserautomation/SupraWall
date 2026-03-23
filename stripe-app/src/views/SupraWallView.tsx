import React, { useState, useEffect } from 'react';
import {
  ContextView,
  Box,
  Text,
  Tabs,
  Tab,
  Button,
  TextField,
  Divider,
  Icon,
  Link,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Badge,
  Spinner,
} from '@stripe/ui-extension-sdk/ui';

const SupraWallView = ({ userContext, extensionContext }: any) => {
  const [activeTab, setActiveTab] = useState('audit');
  const [auditData, setAuditData] = useState<any>(null);
  const [rak, setRak] = useState('');
  const [vaultToken, setVaultToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLinked, setIsLinked] = useState(false);
  const [tenantId, setTenantId] = useState('');

  // Use the defined API URL or fallback to localhost for dev
  const API_URL = process.env.SUPRAWALL_API_URL || 'http://localhost:3000';

  // Use Stripe account ID from context
  const accountId = extensionContext?.account?.id || 'acct_test_123';

  useEffect(() => {
    // Check if account is already linked
    checkLinkStatus();
  }, [accountId]);

  const checkLinkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/v1/tenants/status?stripeAccountId=${accountId}`);
      const data = await response.json();
      if (data.tenantId) {
        setTenantId(data.tenantId);
        setIsLinked(true);
        fetchAuditData(data.tenantId);
      }
    } catch (e) {
      console.error('Check Link Error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLink = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/v1/stripe-app/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripeAccountId: accountId, tenantId: tenantId || 'new_tenant' })
      });
      if (response.ok) {
        setIsLinked(true);
        fetchAuditData(tenantId || 'new_tenant');
      }
    } catch (e) {
      console.error('Link Error:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditData = async (tid: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/v1/stripe-app/usage-audit?tenantId=${tid}`);
      const data = await response.json();
      setAuditData(data);
    } catch (e) {
      console.error('Audit Fetch Error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleWrapKey = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/v1/stripe-app/vault-proxy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: rak, tenantId: tenantId, label: 'Stripe Dashboard Key' })
      });
      const data = await response.json();
      setVaultToken(data.vaultToken);
    } catch (e) {
      console.error('Wrap Error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isLinked) {
    return (
      <ContextView title="Link SupraWall">
        <Box padding="medium" direction="column" gap="medium">
          <Text weight="bold" size="large">Welcome to SupraWall for Stripe</Text>
          <Text color="secondary">To begin protecting your agents and auditing costs, link your SupraWall account.</Text>
          <TextField 
            label="SupraWall Tenant ID" 
            placeholder="tenant_..." 
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
          />
          <Button type="primary" onPress={handleLink} loading={loading}>Link Account</Button>
          <Divider />
          <Text size="xsmall">Don't have a SupraWall account? <Link href="https://suprawall.com/signup">Sign up here</Link></Text>
        </Box>
      </ContextView>
    );
  }

  return (
    <ContextView title="SupraWall Security">
      <Box padding="medium">
        <Tabs value={activeTab} onChange={(val) => setActiveTab(val)}>
          <Tab id="audit" title="Usage Audit" />
          <Tab id="vault" title="Secure Vault" />
          <Tab id="budget" title="Agent Budget" />
        </Tabs>
        
        <Box marginTop="large">
          {activeTab === 'audit' && (
            <Box direction="column" gap="medium">
              <Box direction="row" justifyContent="space-between" alignItems="center">
                <Text weight="bold" size="large">Agent Usage Audit</Text>
                <Button size="small" onPress={() => fetchAuditData(tenantId)} loading={loading}>Refresh</Button>
              </Box>
              
              <Box padding="medium" css={{ backgroundColor: auditData?.healthScore > 80 ? '#f0fff4' : '#fff5f5', border: auditData?.healthScore > 80 ? '1px solid #c6f6d5' : '1px solid #fed7d7', borderRadius: '8px' }}>
                <Box direction="row" justifyContent="space-between">
                    <Text weight="bold" color={auditData?.healthScore > 80 ? 'primary' : 'danger'}>
                    Security Health Score: {auditData?.healthScore || '--'} / 100
                    </Text>
                    {auditData?.potentialSavings > 0 && (
                        <Badge type="info">${auditData.potentialSavings} Savings Found</Badge>
                    )}
                </Box>
                <Text size="small" color="secondary" marginTop="xsmall">
                  {auditData?.totalAnomalies > 0 ? `Detected ${auditData.totalAnomalies} potential rogue agent loops.` : 'No significant anomalies detected.'}
                </Text>
              </Box>

              {auditData?.anomalies?.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Agent</TableCell>
                      <TableCell>Tool</TableCell>
                      <TableCell>Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auditData.anomalies.map((log: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{log.agent_id}</TableCell>
                        <TableCell><code>{log.tool_name}</code></TableCell>
                        <TableCell color="danger">${parseFloat(log.cost_usd).toFixed(4)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : auditData ? (
                  <Box padding="large" direction="row" justifyContent="center">
                      <Text color="secondary">No anomalies found in last 30 days.</Text>
                  </Box>
              ) : <Spinner />}
              
              <Box padding="small">
                <Text size="xsmall" color="secondary">
                  Our refined audit uses standard deviation to detect cost spikes in your agent loops.
                </Text>
              </Box>
            </Box>
          )}

          {activeTab === 'vault' && (
            <Box direction="column" gap="medium">
              <Text weight="bold" size="large">Secure API Vault</Text>
              <Text color="secondary">Proxy your Restricted API Keys through SupraWall to prevent credential theft.</Text>
              
              <TextField 
                label="Stripe Restricted API Key" 
                placeholder="rk_live_..." 
                value={rak} 
                onChange={(e) => setRak(e.target.value)} 
              />
              
              <Button type="primary" onPress={handleWrapKey} loading={loading}>Protect Key</Button>

              {vaultToken && (
                <Box padding="medium" css={{ backgroundColor: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                  <Text weight="bold" size="small">Use this Vault Token:</Text>
                  <Text css={{ fontFamily: 'monospace', wordBreak: 'break-all', fontSize: '11px' }}>{vaultToken}</Text>
                </Box>
              )}
            </Box>
          )}

          {activeTab === 'budget' && (
            <Box direction="column" gap="medium">
              <Text weight="bold" size="large">Agent Budget Controller</Text>
              <Text color="secondary">Auto-suspend agents when customer billing fails.</Text>
              
              <Box padding="medium" css={{ backgroundColor: '#fffaf0', border: '1px solid #feebc8', borderRadius: '8px' }}>
                <Text weight="bold" color="warning">Auto-Revocation: ENABLED</Text>
                <Text size="small">Watching <code>invoice.payment_failed</code> for your organization.</Text>
              </Box>

              <Button size="small">Audit Logs</Button>
            </Box>
          )}
        </Box>
      </Box>
    </ContextView>
  );
};

export default SupraWallView;
