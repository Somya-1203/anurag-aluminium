package com.anurag.aluminium.service;

import com.anurag.aluminium.model.Settings;
import com.anurag.aluminium.repository.SettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SettingsService {
    private final SettingsRepository settingsRepository;

    public Settings getSettings() {
        List<Settings> settingsList = settingsRepository.findAll();
        if (settingsList.isEmpty()) {
            Settings settings = new Settings();
            return settingsRepository.save(settings);
        }

        Settings settings = settingsList.get(0);
        boolean changed = false;
        if (settings.getDefaultRate() == null) {
            settings.setDefaultRate(100.0);
            changed = true;
        }
        if (settings.getCompanyName() == null) {
            settings.setCompanyName("Anurag Aluminium & Glass House");
            changed = true;
        }
        if (settings.getCompanyAddress() == null) {
            settings.setCompanyAddress("55, Sainath Colony, Alakhdham Nagar\nIndore Road, Ujjain");
            changed = true;
        }
        if (settings.getCompanyContactNumbers() == null) {
            settings.setCompanyContactNumbers("9827086001\n9131001671");
            changed = true;
        }
        if (settings.getCompanyOwners() == null) {
            settings.setCompanyOwners("Sandeep Jain\nMehul Jain");
            changed = true;
        }
        if (settings.getCompanyLogoUrl() == null) {
            settings.setCompanyLogoUrl("");
            changed = true;
        }
        if (changed) {
            return settingsRepository.save(settings);
        }
        return settings;
    }

    public Settings updateSettings(
            Double defaultRate,
            String companyName,
            String companyAddress,
            String companyContactNumbers,
            String companyOwners,
            String companyLogoUrl
    ) {
        Settings settings = getSettings();
        if (defaultRate != null) {
            settings.setDefaultRate(defaultRate);
        }
        if (companyName != null) {
            settings.setCompanyName(companyName);
        }
        if (companyAddress != null) {
            settings.setCompanyAddress(companyAddress);
        }
        if (companyContactNumbers != null) {
            settings.setCompanyContactNumbers(companyContactNumbers);
        }
        if (companyOwners != null) {
            settings.setCompanyOwners(companyOwners);
        }
        if (companyLogoUrl != null) {
            settings.setCompanyLogoUrl(companyLogoUrl);
        }
        return settingsRepository.save(settings);
    }
}